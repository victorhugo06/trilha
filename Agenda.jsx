// src/pages/AdminPanel.jsx
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase"; // Importa a configuração do Firebase
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import Modal from "react-modal";

// Configuração do React Modal
Modal.setAppElement("#root");

const Agenda = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar se está retraído
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    patient: '',
    attendant: '',
    date_start: '',
    date_end: '',
  });

  const eventsCollectionRef = collection(db, 'events');

  // Função para formatar datas para o formato do input datetime-local
  const formatDateToDateTimeLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchEvents = async () => {
    const data = await getDocs(eventsCollectionRef);
    setEvents(
      data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        start: doc.data().date_start,
        end: doc.data().date_end,
      }))
    );
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    setFormData({
      title: '',
      description: '',
      patient: '',
      attendant: '',
      date_start: formatDateToDateTimeLocal(info.dateStr),
      date_end: formatDateToDateTimeLocal(info.dateStr),
    });
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (info) => {
    const event = events.find((e) => e.id === info.event.id);
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        patient: event.patient,
        attendant: event.attendant,
        date_start: formatDateToDateTimeLocal(event.start),
        date_end: formatDateToDateTimeLocal(event.end),
      });
      setSelectedEvent(event);
      setModalOpen(true);
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.title || !formData.date_start || !formData.date_end) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      if (selectedEvent) {
        const eventDoc = doc(db, 'events', selectedEvent.id);
        await updateDoc(eventDoc, formData);
        toast.success('Evento atualizado com sucesso!');
      } else {
        await addDoc(eventsCollectionRef, formData);
        toast.success('Evento adicionado com sucesso!');
      }
      fetchEvents();
      setModalOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar o evento.');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const eventDoc = doc(db, 'events', selectedEvent.id);
      await deleteDoc(eventDoc);
      toast.success('Evento excluído com sucesso!');
      fetchEvents();
      setModalOpen(false);
    } catch (error) {
      toast.error('Erro ao excluir o evento.');
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
        className={`${
          isCollapsed ? "w-22" : "w-60"
        } bg-sky-400 text-white flex flex-col items-center py-4 transition-all duration-300`}
        >
        {/* Botão para retrair/expandir */}
        <button
          className="self-start ml-2 text-white hover:text-gray-200 bg-orange-400 rounded-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "➕" : "➖"}
        </button>

        {/* Foto do usuário */}
        {!isCollapsed && (
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
            <img
              src="https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-business-men-icon-png-image_4186858.jpg"
              alt="Usuário"
              className="rounded-full"
            />
          </div>
        )}

        {/* Nome do usuário (opcional) */}
        {!isCollapsed && <h2 className="text-lg font-bold mb-8">Bem-vindo!</h2>}

        {/* Menu de opções */}
        <nav className="flex flex-col w-full items-center">
          <button
            className={`py-3 px-4 text-left hover:bg-blue-600 w-full ${
              isCollapsed ? "text-sm" : ""
            }`}
            onClick={() => navigate("/agenda")}
          >
            Agenda
          </button>
          <button
            className={`py-3 px-4 text-left hover:bg-blue-600 w-full ${
              isCollapsed ? "text-sm" : ""
            }`}
            onClick={() => navigate("/dashboards")}
          >
            Dashboards
          </button>
          <button
            className={`py-3 px-4 text-left hover:bg-blue-600 w-full ${
              isCollapsed ? "text-sm" : ""
            }`}
            onClick={() => navigate("/pacientes")}
          >
            Pacientes
          </button>
          <button
            className={`py-3 px-4 text-left hover:bg-blue-600 w-full ${
              isCollapsed ? "text-sm" : ""
            }`}
            onClick={() => navigate("/usuarios")}
          >
            Usuários
          </button>
        </nav>

        {/* Botão de Logout */}
        {!isCollapsed && (
          <button
            className="mt-auto py-2 px-4 bg-orange-400 hover:bg-orange-500 rounded w-3/4"
            onClick={handleLogout}
          >
            Sair
          </button>
        )}
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Agenda</h2>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable
            selectable
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
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
          />

          {modalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              style={{ zIndex: 9999 }}
            >
              <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">
                  {selectedEvent ? 'Editar Evento' : 'Adicionar Evento'}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título"
                    className="w-full border p-2 rounded"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Descrição"
                    className="w-full border p-2 rounded"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Paciente"
                    className="w-full border p-2 rounded"
                    value={formData.patient}
                    onChange={(e) =>
                      setFormData({ ...formData, patient: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Atendente"
                    className="w-full border p-2 rounded"
                    value={formData.attendant}
                    onChange={(e) =>
                      setFormData({ ...formData, attendant: e.target.value })
                    }
                  />
                  <input
                    type="datetime-local"
                    className="w-full border p-2 rounded"
                    value={formData.date_start}
                    onChange={(e) =>
                      setFormData({ ...formData, date_start: e.target.value })
                    }
                  />
                  <input
                    type="datetime-local"
                    className="w-full border p-2 rounded"
                    value={formData.date_end}
                    onChange={(e) =>
                      setFormData({ ...formData, date_end: e.target.value })
                    }
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  {selectedEvent && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={handleDeleteEvent}
                    >
                      Excluir
                    </button>
                  )}
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleFormSubmit}
                  >
                    Salvar
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
