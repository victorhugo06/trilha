// src/pages/AdminPanel.jsx
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "react-modal"; // Configuração do React Modal
import { Calendar, BarChart, Users2Icon, ClipboardList, Settings, LogOut, X, MenuIcon, Edit, PlusIcon } from "lucide-react";
import { useUser } from "../context/UserContext";


Modal.setAppElement("#root");

const API_URL = "http://localhost:5000/api/services"; // Ajuste conforme necessário

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser(); // Obtém o usuário logado
  const isActive = (path) => location.pathname === path;
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ treatmentType: "", periodicity: "" });
  const [editingId, setEditingId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar se está retraído

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (error) {
      toast.error("Erro ao carregar Planos.", error);
    }
  };

/*   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await axios.post(API_URL, formData);
        toast.success("Serviço cadastrado com sucesso!");
      }
      fetchServices();
      closeModal();
    } catch (error) {
      toast.error("Erro ao salvar serviço.", error);
    }
  };

  const handleEdit = (service) => {
    setFormData({ treatmentType: service.treatmentType, periodicity: service.periodicity });
    setEditingId(service._id);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success("Serviço excluído com sucesso!");
        fetchServices();
      } catch (error) {
        toast.error("Erro ao excluir serviço.", error);
      }
    }
  };

  const openModal = () => {
    setFormData({ treatmentType: "", periodicity: "" });
    setEditingId(null);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
      {/* Formulário */}
        <div className="w-full p-4 md:p-6 mx-auto">
          <h2 className="text-2xl font-bold mb-4">Tipos de atendimentos</h2>
          <button
              className="bg-green-500 text-white py-2 px-4 mb-4 flex items-center gap-2"
              onClick={() => openModal()}
            >
              < PlusIcon size={24} /> Novo plano
            </button>
          <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded shadow-lg w-full max-w-lg max-h-[94vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-slate-100">
              <h2 className="text-lg font-bold mb-4">{editingId ? "Editar Serviço" : "Cadastrar Serviço"}</h2>
              <select
                value={formData.treatmentType || ""}
                onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="">Selecione um atendimento</option>
                <option value="individualoffice">Individual em consultório</option>
                <option value="groupoffice">Dupla/Grupo em consultório</option>
                <option value="parentalmeeting">Reunião Parental</option>
                <option value="externalvisit">Visita Externa</option>
                <option value="home">Domiciliar</option>
              </select>
              <select
                value={formData.periodicity || ""}
                onChange={(e) => setFormData({ ...formData, periodicity: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              >
                <option value="">Selecione uma frequência</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
                <option value="twomonthly">A cada dois meses</option>
                <option value="threemonthly">A cada três meses</option>
                <option value="sixmonthly">A cada seis meses</option>
              </select>
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  {editingId ? "Atualizar" : "Cadastrar"}
                </button>
                <button onClick={closeModal} className="text-black py-2 px-4">Fechar</button>
              </div>
            </form>
            </div>
          </Modal>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Nome</th>
                <th className="p-2 border">Periodicidade</th>
                <th className="p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border">
                  <td className="p-2 border">{service.treatmentType === 'individualoffice' ? 'Individual em consultório' : service.treatmentType === 'groupoffice' ? 'Dupla/Grupo em consultório' : service.treatmentType === 'parentalmeeting' ? 'Reunião Parental' : service.treatmentType === 'externalvisit' ? 'Visita Externa' : service.treatmentType === 'home' ? 'Domiciliar' : service.treatmentType}</td>
                  <td className="p-2 border">
                    {service.periodicity === 'daily' ? 'Diário' : service.periodicity === 'weekly' ? 'Semanal' : service.periodicity === 'biweekly' ? 'Quinzenal' : service.periodicity === 'monthly' ? 'Mensal' : service.periodicity === 'twomonthly' ? 'A cada dois meses' : service.periodicity === 'threemonthly' ? 'A cada três meses' :  service.periodicity === 'sixmonthly' ? 'A cada seis meses' : service.periodicity}
                  </td>
                  <td className="p-2 border text-center flex">
                    <button onClick={() => handleEdit(service)} className="bg-yellow-500 text-white px-3 py-2 mr-1 rounded flex items-center gap-2">< Edit size={20} /></button>
                    <button onClick={() => handleDelete(service._id)} className="bg-red-500 text-white px-3 py-2 rounded flex items-center gap-2">< X size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Services;
