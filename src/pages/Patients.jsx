// src/pages/AdminPanel.jsx
import { Calendar, BarChart, Users2Icon, ClipboardList, Settings, LogOut, X, MenuIcon, PlusIcon, Edit } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal"; // Configuração do React Modal
import FileUpload from "../components/FileUpload";
import Select from 'react-select';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../context/UserContext";


Modal.setAppElement("#root");

const API_URL = "http://localhost:5000/api/patients"; // Ajuste conforme necessário
const USERS_API = "http://localhost:5000/api/users/patients"; // Rota para buscar usuários do tipo "P"
const SERVICES_API = "http://localhost:5000/api/services"; // Rota para buscar usuários do tipo "P"
const UPLOADS_API = "http://localhost:5000/api/uploads"; // Rota para buscar uploads

const Patients = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]); // Armazena a lista de usuários do tipo "P"
  const { user, setUser } = useUser(); // Obtém o usuário logado
  const [services, setServices] = useState([]); // Armazena a lista de usuários do tipo "P"
  const [formData, setFormData] = useState({ user: "", name: "", treatmentType: [], description: "", attachments: [] });
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar se está retraído
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // 🔹 Carregar pacientes e usuários ao carregar a página
  useEffect(() => {
    fetchPatients();
    fetchUsers();
    fetchServices();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(API_URL);
      setPatients(response.data);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      toast.error("Erro ao carregar pacientes.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(USERS_API);
      setUsers(response.data);
    } catch (error) {
      toast.error("Erro ao carregar usuários.");
      console.error("Erro ao buscar pacientes:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(SERVICES_API);
      setServices(response.data);
    } catch (error) {
      toast.error("Erro ao carregar usuários.");
      console.error("Erro ao buscar pacientes:", error);
    }
  };

  // Mapeia os serviços para o formato esperado pelo react-select
  const options = services.map(service => ({
    value: service._id,
    label: service.treatmentType === 'individualoffice' ? 'Individual em consultório' :
           service.treatmentType === 'groupoffice' ? 'Dupla/Grupo em consultório' :
           service.treatmentType === 'parentalmeeting' ? 'Reunião Parental' :
           service.treatmentType === 'externalvisit' ? 'Visita Externa' :
           service.treatmentType === 'home' ? 'Domiciliar' :
           service.treatmentType === '' ? '' :
           service.treatmentType
  }));

  // Manipulador de mudança para atualizar o estado do formulário
  const handleChange = selectedOptions => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData({ ...formData, treatmentType: selectedValues });
  };

  const handleFileChange = (files) => {
    // Atualiza a lista de anexos acumulando os novos arquivos aos existentes
    setAttachments(files);
  };

  // 🔹 Envia o formulário (Criar ou Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('user', formData.user || '');
    data.append('name', formData.name || '');
    data.append('description', formData.description || '');
    
    if (formData.treatmentType && formData.treatmentType.length > 0) {
      formData.treatmentType.forEach(type => data.append('treatmentType', type));
    }
  
    attachments.forEach((file) => data.append('attachments', file));
  
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Paciente atualizado com sucesso!");
      } else {
        await axios.post(API_URL, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success("Paciente cadastrado com sucesso!");
      }
  
      fetchPatients();
      setFormData({ user: "", name: "", treatmentType: [], description: "", attachments: [] });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar paciente:", error);
      toast.error("Erro ao salvar paciente.");
    }
  };

  // 🔹 Edita um paciente
  const handleEdit = async (patient) => {
    setFormData({ user: patient.user, name: patient.name, treatmentType: patient.treatmentType || [], description: patient.description || "" });
    setEditingId(patient._id);
    setIsModalOpen(true);

    // Carregar anexos do paciente
    try {
      const response = await axios.get(`${UPLOADS_API}/${patient._id}`);
      setAttachments(response.data.map(file => ({
        name: file.filename,
        path: file.filename
      })));
    } catch (error) {
      console.error("Erro ao carregar anexos do paciente:", error);
    }
  };

  // 🔹 Exclui um paciente
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Paciente excluído com sucesso!");
        fetchPatients();
      } catch (error) {
        console.error("Erro ao excluir paciente:", error);
        toast.error("Erro ao excluir paciente.");
      }
    }
  };
  // 🔹 Abrir modal para criar ou editar
  const openModal = (patient = null) => {
    if (patient) {
      setFormData({ user: patient.user, name: patient.name, treatmentType: patient.treatmentType || [], description: patient.description || "", attachments : patient.attachments || [] });
      setEditingId(patient._id);
      setAttachments(patient.attachments || []);
    } else {
      console.log('aqui')
      setFormData({ user: "", name: "", treatmentType: [], description: "" });
      setEditingId(null);
      setAttachments([]);
    }
    setIsModalOpen(true);
  };

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
        localStorage.removeItem("user"); // Remove usuário do localStorage
        setUser(null); // Limpa o contexto do usuário
  
        // Redireciona para a página de login
        navigate("/login");
        // Redireciona para a página de login
        navigate("/login");
      } else {
        throw new Error('Erro ao fazer logout');
      }
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100">
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
    {/* Área Principal */}
    <main
      className={`transition-all duration-300 ${
        isCollapsed ? "ml-0" : "ml-[130px]"
      }`}
    >
      
      <div className="w-full p-4 md:p-6 mx-auto">
          <h2 className="text-2xl font-bold mb-4">Pacientes</h2>
          <button
              className="bg-green-500 text-white py-2 px-4 mb-4 flex items-center gap-2"
              onClick={() => openModal()}
            >
              < PlusIcon size={24} /> Novo paciente
            </button>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Nome</th>
                <th className="p-2 border">Tipo de Atendimento</th>
                <th className="p-2 border">Descrição</th>
                <th className="p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id} className="border">
                  <td className="p-2 border">{users.find((u) => u._id === patient.user)?.name || "Desconhecido"}</td>
                  <td className="p-2 border">
                    {patient.treatmentType.length > 0 
                      ? patient.treatmentType.map(id => {
                          const service = services.find(service => service._id === id);
                          
                          if (!service) {
                            return "Desconhecido"; // Se não encontrar o serviço, retorna "Desconhecido"
                          } else if (service.treatmentType === "individualoffice") {
                            return "Individual em consultório"; // Exemplo: Se for "Tipo A", exibe "Plano Especial"
                          } else if (service.treatmentType === "groupoffice") {
                            return "Grupo em consultório"; // Exemplo: Se for "Tipo B", exibe "Plano Premium"
                          } else if (service.treatmentType === "parentalmeeting") {
                            return "Reunião Parental"; // Exemplo: Se for "Tipo B", exibe "Plano Premium"
                          } else if (service.treatmentType === "home") {
                            return "Domiciliar"; // Exemplo: Se for "Tipo B", exibe "Plano Premium"
                          } else if (service.treatmentType === "externalvisit") {
                            return "Visita externa"; // Exemplo: Se for "Tipo B", exibe "Plano Premium"
                          } else {
                            return service.treatmentType; // Caso contrário, exibe o nome do tratamento normalmente
                          }
                        }).join(", ") // Junta os valores em uma string separada por vírgula
                      : "Sem plano"} 
                  </td>
                  <td className="p-2 border">{patient.description}</td>
                  <td className="p-2 border flex">
                    <button
                      onClick={() => handleEdit(patient)}
                      className="bg-yellow-500 text-white px-3 py-2 mr-1 rounded flex items-center gap-2"
                    >
                      < Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(patient._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2"
                    >
                      < X size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded shadow-lg w-full max-w-lg max-h-[94vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-4 border rounded bg-slate-100">
                <h2 className="text-lg font-bold mb-4">{editingId ? 'Editar Paciente '+ formData.name : "Cadastrar Paciente"}</h2>
               {!editingId && ( 
                  <select
                  name="userId"
                  value={formData.userId}
                  onChange={(e) => {
                    const selectedUser = users.find(user => user._id === e.target.value);
                    setFormData({
                      ...formData,
                      user: e.target.value,
                      name: selectedUser ? selectedUser.name : ''
                    });
                  }}
                  required
                  className="p-2 border rounded w-full mb-2"
                >
                  <option value="">Selecione um Paciente</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                )}
                <Select
                  isMulti
                  name="treatmentType"
                  options={options}
                  value={options.filter(option => formData.treatmentType.includes(option.value))}
                  onChange={handleChange}
                  className="basic-multi-select mb-2"
                  classNamePrefix="select"
                  placeholder="Planos interventivos..."
                />
                <input 
                  type="text" 
                  name="description" 
                  value={formData.description} 
                  onChange={(e) => {
                    setFormData({ ...formData, [e.target.name]: e.target.value })}} 
                  placeholder="Descrição" 
                  className="p-2 border rounded w-full mb-2" 
                />

                <FileUpload onFilesChange={handleFileChange} initialFiles={attachments} userId={formData.user} />

                <div className="flex justify-between mt-4">
                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                    {editingId ? "Atualizar" : "Cadastrar"}
                  </button>
                  <button
                    className="text-black py-2 px-4 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Fechar
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default Patients;
