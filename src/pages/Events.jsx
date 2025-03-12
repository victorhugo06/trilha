import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import '@fullcalendar/core';
import axios from "axios"; // Para requisições HTTP
import '../index.css';
import Modal from "react-modal";
import { Calendar, BarChart, ClipboardList, Settings, LogOut, X, MenuIcon, Users2Icon } from "lucide-react";
import { useUser } from "../context/UserContext";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select';

// Configuração do React Modal
Modal.setAppElement("#root");
const USERS_API = "http://localhost:5000/api/patients"; // Rota para buscar usuários do tipo "P"
const SERVICES_API = "http://localhost:5000/api/services"; // Rota para buscar usuários do tipo "P"

const Agenda = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user, logout } = useUser(); // Obtém o usuário logado
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    attendant: [], // Garante que seja um array vazio no início
    patient: [], // Garante que seja um array vazio no início
    date_start: '',
    date_end: '',
  });
  const [users, setUsers] = useState([]); // Estado para armazenar os usuários
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const calendarRef = useRef(null);
  const [selectedPatients, setSelectedPatients] = useState([]); // Pacientes selecionados
  const [selectedAttendants, setSelectedAttendants] = useState([]); // Atendentes selecionados
  const [filterPatient, setFilterPatient] = useState('');
  const [filterAttendant, setFilterAttendant] = useState('');

  // Buscar eventos da API com filtros
useEffect(() => {
  const fetchEvents = async () => {
    try {
      // Monta os parâmetros da requisição com base nos filtros
      const params = {};
      if (filterPatient) params.patient = filterPatient;
      if (filterAttendant) params.attendant = filterAttendant;

      // Faz a requisição com os filtros (se existirem)
      const response = await axios.get('http://localhost:5000/api/events', { params });
      
      // Formata os eventos recebidos
      const formattedEvents = response.data.map(event => {
        const isPastEvent = new Date(event.date_end) < new Date(); // Verifica se o evento já passou
        return {
          id: event._id,
          title: event.title,
          description: event.description,
          attendant: event.attendant,
          patient: event.patient,
          start: event.date_start,
          end: event.date_end,
          classNames: isPastEvent ? ['past-event'] : [] // Adiciona a classe 'past-event' se o evento já passou
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data); // Armazena os usuários no estado
    } catch (error) {
      console.error("Erro ao buscar usuários:", error.message);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get(USERS_API);
      setPatients(response.data);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      toast.error("Erro ao carregar pacientes.");
    }
  };
  const fetchServices = async () => {
    try {
      const response = await axios.get(SERVICES_API);
      setServices(response.data);
    } catch (error) {
      console.error("Erro ao buscar atendimentos:", error);
      toast.error("Erro ao carregar atendimentos.");
    }
  };

  fetchUsers();
  fetchPatients();
  fetchServices();
  fetchEvents();
}, [filterPatient, filterAttendant]); // Atualiza sempre que os filtros forem alterados


  // Função para formatar datas para o formato do input datetime-local
  const formatDateToDateTimeLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      const formattedEvents = response.data.map(event => {
        const isPastEvent = new Date(event.date_end) < new Date(); // Verifica se o evento já passou
        return {
          id: event._id,
          title: event.title,
          description: event.description,
          attendant: event.attendant,
          patient: event.patient,
          start: event.date_start,
          end: event.date_end,
          classNames: isPastEvent ? ['past-event'] : [] // Adiciona a classe 'past-event' se o evento já passou
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.removeAllEvents();
      calendarApi.addEventSource(events);
    }
  }, [events]);

  const handleDateClick = (info) => {
    // Converte a data para o horário local
    const clickedDate = new Date(info.date);
    //const localDate = new Date(clickedDate.getTime() + clickedDate.getTimezoneOffset() * 60000);
    setFormData({
      id: '', // Adicione este campo
      title: '',
      description: '',
      date_start: formatDateToDateTimeLocal(clickedDate),
      date_end: formatDateToDateTimeLocal(clickedDate),
    });
    setSelectedEvent(null);
    setModalOpen(true);
    setSelectedPatients(info.patient || []); // Atualizar pacientes selecionados
    setSelectedAttendants(info.attendant || []); // Atualizar atendentes selecionados
  };

  const handleEventClick = (clickInfo) => {
    const clickedDate1 = new Date(clickInfo.event.start);
    const clickedDate2 = new Date(clickInfo.event.end);
    setSelectedEvent(clickInfo.event); // Define o evento selecionado
    setFormData({
      id: clickInfo.event.id, // Armazena o ID
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      date_start: formatDateToDateTimeLocal(clickedDate1), // Formato datetime-local
      date_end: formatDateToDateTimeLocal(clickedDate2),
    });
    setModalOpen(true); // Abre o modal
    setSelectedPatients(clickInfo.event.extendedProps.patient || []); // Atualizar pacientes selecionados
    setSelectedAttendants(clickInfo.event.extendedProps.attendant || []); // Atualizar atendentes selecionados
  };

  // Enviar ou atualizar evento
  const handleFormSubmit = async () => {
    if (!formData.title || !formData.description || !selectedAttendants.length || !selectedPatients.length || !formData.date_start || !formData.date_end) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
     // Atualize o formData com os valores selecionados
     const updatedFormData = {
      ...formData,
      attendant: selectedAttendants,
      patient: selectedPatients,
      frequency: formData.frequency || null, // Inclui a frequência (ou null se não for selecionada)
      repetitions: formData.repetitions || 1, // Define 1 como padrão se não houver repetições
    };
    
    try {
      if (updatedFormData.id) {
        setLoading(true); // Inicia o loader
        // Atualizar evento
        await axios.put(
          `http://localhost:5000/api/events/${updatedFormData.id}`,
          updatedFormData
        );
        toast.success('Evento atualizado com sucesso!');
      } else {
        // Verificar se já existe um evento com o paciente e o atendente
        const checkResponse = await axios.post('http://localhost:5000/api/events/check', {
          attendants: updatedFormData.attendant,
          patients: updatedFormData.patient,
          date_start: updatedFormData.date_start,
          date_end: updatedFormData.date_end,
        });

        if (checkResponse.data.exists) {
          toast.error('Já existe um evento cadastrado com o(s) paciente(s) e o(s) atendente(s) selecionados no período informado.');
          return;
        }
        // Criar novo evento
        await axios.post('http://localhost:5000/api/events', updatedFormData);
        toast.success('Evento adicionado com sucesso!');
      }
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error('Erro ao salvar o evento.');
      console.log(error);
    } finally {
      setLoading(false); // Finaliza o loader
    }
  };

  // Excluir evento
  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${formData.id}`);
      toast.success('Evento excluído com sucesso!');
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao excluir o evento.';
      toast.error(errorMessage);
      console.log(error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      // Chama o backend para realizar o logout
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Aqui você pode adicionar o token de autenticação se necessário
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
  
      if (response.ok) {
        // Limpa o token armazenado no frontend
        localStorage.removeItem('auth_token'); // Remova o token da sessão local
        logout(); // Limpa o contexto do usuário
  
        // Redireciona para a página de login
        navigate("/login");
      } else {
        throw new Error('Erro ao fazer logout');
      }
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  // Função para lidar com a seleção de pacientes
  const handlePatientChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedPatients(values);
  };

  // Função para lidar com a seleção de atendentes
  const handleAttendantChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedAttendants(values);
  };

  // Função para gerar o PDF diretamente a partir dos dados
  const generatePDF = () => {
    const doc = new jsPDF();

    // Obtenha a instância do calendário para acessar o mês atual
    const calendarApi = calendarRef.current?.getApi();
    const currentDate = calendarApi ? calendarApi.getDate() : new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Array com os nomes dos meses em português
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Configurações iniciais do PDF
    doc.setFontSize(12);
    doc.text(`Relatório de Atendimentos - ${monthNames[currentMonth]} ${currentYear}`, 14, 20);

    // Filtra e ordena os eventos por data de início no mês atual
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    }).sort((a, b) => new Date(a.start) - new Date(b.start));

    // Agrupa eventos por paciente
    const eventsByPatient = filteredEvents.reduce((acc, event) => {
      event.patient.forEach(id => {
        const patient = patients.find(p => p.user === id);
        const patientName = patient ? patient.name : 'Desconhecido';
        if (!acc[patientName]) {
          acc[patientName] = [];
        }
        acc[patientName].push(event);
      });
      return acc;
    }, {});

    // Adiciona uma tabela para cada paciente
    let startY = 30;
    Object.keys(eventsByPatient).forEach(patientName => {
      const patientEvents = eventsByPatient[patientName];

      // Adiciona o nome do paciente como título
      doc.setFontSize(10);
      doc.text(`Paciente: ${patientName}`, 14, startY);
      startY += 10;

      // Dados da tabela para o paciente
      const data = patientEvents.map(event => [
        event.title,
        event.description,
        new Date(event.start).toLocaleString(),
        new Date(event.end).toLocaleString(),
        event.attendant.map(id => {
          const attendant = users.find(user => user._id === id);
          return attendant ? attendant.name : 'Desconhecido';
        }).join(', ')
      ]);

      // Cabeçalhos da tabela
      const headers = [['Título', 'Descrição', 'Início', 'Fim', 'Atendentes']];

      // Adiciona a tabela ao PDF
      doc.autoTable({
        head: headers,
        body: data,
        startY: startY,
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 10, cellPadding: 3 }
      });

      // Atualiza a posição Y para a próxima tabela
      startY = doc.lastAutoTable.finalY + 10;
    });

    // Salva o PDF com o nome do primeiro paciente
    const firstPatientName = Object.keys(eventsByPatient)[0] || 'Desconhecido';
    doc.save(`atendimentos_${firstPatientName}.pdf`);
  };
    
  return (
    <div className="relative min-h-screen bg-slate-100">
      {/* Área Principal */}
      <main
        className={`transition-all duration-300 ${
          isCollapsed ? "ml-0" : "ml-[130px]"
        }`}
      >
        {/* Botão para abrir o sidebar (aparece apenas quando está retraído) */}
        {isCollapsed && (
          <button
            className="fixed top-2 left-2 backdrop-brightness-50 text-white p-2 rounded-full z-50"
            onClick={() => setIsCollapsed(false)}
          >
            <MenuIcon size={20} />
          </button>
        )}

        {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full max-w-36 bg-sky-400 text-white flex flex-col items-center py-2 transition-transform duration-200 z-60 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ width: "240px" }}
      >
        <button
          className="self-end mr-1 bg-orange-400 text-white p-2 rounded-full flex items-center justify-center gap-2"
          onClick={() => setIsCollapsed(true)}
        >
          <X size={20} />
        </button>

        {/* Foto do usuário */}
        <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
          <img
            src="https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-business-men-icon-png-image_4186858.jpg"
            alt="Usuário"
            className="rounded-full object-cover"
          />
        </div>

        {/* Nome do usuário */}
        <h2 className="text-lg font-bold mb-8">{user?.name || "Usuário"}</h2>

        {/* Menu de opções */}
        <nav className="flex flex-col w-full items-center space-y-2">
          <button
            className={`py-2 px-4 text-left w-full flex items-center gap-2 ${isActive('/events') ? 'bg-blue-600 text-white' : 'hover:bg-blue-600'}`}
            onClick={() => navigate("/events")}
          >
            <Calendar size={18} /> Agenda
          </button>
          <button
            className={`py-2 px-4 text-left w-full flex items-center gap-2 ${isActive('/dashboards') ? 'bg-blue-600 text-white' : 'hover:bg-blue-600'}`}
            onClick={() => navigate("/dashboards")}
          >
            <BarChart size={18} /> Dashboards
          </button>
          <button
            className={`py-2 px-4 text-left w-full flex items-center gap-2 ${isActive('/patients') ? 'bg-blue-600 text-white' : 'hover:bg-blue-600'}`}
            onClick={() => navigate("/patients")}
          >
            <ClipboardList size={18} /> Pacientes
          </button>
          <button
            className={`py-2 px-4 text-left w-full flex items-center gap-2 ${isActive('/services') ? 'bg-blue-600 text-white' : 'hover:bg-blue-600'}`}
            onClick={() => navigate("/services")}
          >
            <Settings size={18} /> Planos
          </button>
          <button
            className={`py-2 px-4 text-left w-full flex items-center gap-2 ${isActive('/users') ? 'bg-blue-600 text-white' : 'hover:bg-blue-600'}`}
            onClick={() => navigate("/users")}
          >
            <Users2Icon size={18} /> Usuários
          </button>
          <button
            className={`py-2 px-4 text-left w-full flex items-center gap-2 ${isActive('/remindercontrol') ? 'bg-blue-600 text-white' : 'hover:bg-blue-600'}`}
            onClick={() => navigate("/remindercontrol")}
          >
            <Settings size={18} /> Rotina
          </button>
        </nav>

        {/* Botão de Logout */}
        <button
          className="text-white mt-auto py-2 px-4 w-full flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Sair
        </button>
      </aside>
        <div className="w-full p-4 md:p-6 mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-left">Agenda</h2>
          <div className="filters mb-4 space-x-2">
            {/* Filtro por Paciente */}
            <select
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-orange-400 hover:bg-orange-500 text-white"
            >
              <option value="">Todos os Pacientes</option>
              {users
                .filter(user => user.type === "P") // Apenas pacientes
                .map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
            </select>

            {/* Filtro por Atendente */}
            <select
              value={filterAttendant}
              onChange={(e) => setFilterAttendant(e.target.value)}
              className="p-2 border border-gray-300 rounded bg-orange-400 hover:bg-orange-500 text-white "
            >
              <option value="">Todos os Atendentes</option>
              {users
                .filter(user => user.type === "A") // Apenas atendentes
                .map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
            </select>
            <button
            className="bg-blue-500 text-white py-2 px-2 rounded"
            onClick={generatePDF}
            >
              Gerar Relatório PDF
            </button>
            <div className="event-legend justify-end flex gap-2">
              <div className="event-done">Concluídos</div>
              <div className="event-pending">Pendentes</div>
            </div>
          </div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable
            selectable
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            contentHeight="auto" // Ajusta automaticamente a altura
            height="auto" // Permite usar o CSS para scroll
            contentWidth="auto" // Ajusta automaticamente a altura
            width="auto" // Permite usar o CSS para scroll
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
            }}
            locale="pt-br"
            aspectRatio={window.innerWidth < 768 ? 1 : 2}
          />

          {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-slate-50 p-4 rounded shadow-lg w-full max-w-lg max-h-[94vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">
                  {selectedEvent ? "Editar Evento" : "Adicionar Evento"}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Descrição"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />

                  {/* Seção de atendentes */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Atendentes</h4>
                    <Select
                      isMulti
                      options={users
                        .filter(user => user.type === "A") // Filtrar apenas usuários do tipo "A"
                        .map(user => ({ value: user._id, label: user.name }))}
                      value={users
                        .filter(user => selectedAttendants.includes(user._id))
                        .map(user => ({ value: user._id, label: user.name }))}
                      onChange={handleAttendantChange}
                      className="w-full"
                      classNamePrefix="react-select" // Prefixo para estilização
                      placeholder="Selecione atendentes..."
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          border: '1px solid gray',
                          boxShadow: 'none',
                          '&:hover': {
                            border: '1px solid blue',
                          },
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: '#e0f7fa',
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: '#00796b',
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          ':hover': {
                            backgroundColor: '#ff5252',
                            color: 'white',
                          },
                        }),
                      }}
                    />
                  </div>

                  {/* Seção de pacientes */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Pacientes</h4>
                    <Select
                    isMulti
                    options={patients.map((patient) => ({
                      value: patient.user,
                      label: `${patient.name} - ${patient.treatmentType.length > 0
                        ? patient.treatmentType.map(id => {
                            const service = services.find(service => service._id === id);
                            if (!service) {
                              return "Desconhecido"; 
                            } else if (service.treatmentType === "individualoffice") {
                              return "Individual em consultório" +'('+ service.periodicity +')';
                            } else if (service.treatmentType === "groupoffice") {
                              return "Grupo em consultório" +'('+ service.periodicity +')';
                            } else if (service.treatmentType === "parentalmeeting") {
                              return "Reunião Parental" +'('+ service.periodicity +')';
                            } else if (service.treatmentType === "home") {
                              return "Domiciliar" +'('+ service.periodicity +')';
                            } else if (service.treatmentType === "externalvisit") {
                              return "Visita externa" +'('+ service.periodicity +')';
                            } else {
                              return service.treatmentType +'('+ service.periodicity +')';
                            }
                          }).join(", ")
                        : "Sem plano"}`
                    }))}
                    value={patients
                      .filter(patient => selectedPatients.includes(patient.user))
                      .map(patient => ({ value: patient.user, label: `${patient.name} - ${patient.treatmentType.length > 0 ? patient.treatmentType.map(id => {
                          const service = services.find(service => service._id === id);
                          return service ? service.treatmentType : "Desconhecido";
                        }).join(", ") : "Sem plano"}` }))}
                    onChange={handlePatientChange}
                    className="w-full"
                    classNamePrefix="react-select" 
                    placeholder="Selecione pacientes..."
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: '1px solid gray',
                        boxShadow: 'none',
                        '&:hover': {
                          border: '1px solid blue',
                        },
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: '#e0f7fa',
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: '#00796b',
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        ':hover': {
                          backgroundColor: '#ff5252',
                          color: 'white',
                        },
                      }),
                    }}
                  />
                  </div>

                  <input
                    type="datetime-local"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.date_start}
                    onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
                  />
                  <input
                    type="datetime-local"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.date_end}
                    onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
                  />
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Frequência</h4>
                    <select
                      value={formData.frequency || ""}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Selecione uma frequência</option>
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                      <option value="twomonthly">Bi-mensal</option>
                      <option value="threemonthly">Tri-mensal</option>
                      <option value="sixmonthly">Semestral</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Repetições</h4>
                    <input
                      type="number"
                      min="1"
                      value={formData.repetitions || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, repetitions: parseInt(e.target.value, 10) || 0 })
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Número de repetições"
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  {loading ? (
                    <div className="spinner"></div> // Exibe o spinner
                      ) : (
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded"
                      onClick={() => handleFormSubmit(formData)}
                    >
                    {selectedEvent ? "Alterar" : "Adicionar"}
                    </button>
                  )}
                  {selectedEvent && (
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded"
                      onClick={handleDeleteEvent}
                    >
                      Excluir
                    </button>
                  )}
                  <button
                    className="text-black py-2 px-4"
                    onClick={() => setModalOpen(false)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Agenda;
