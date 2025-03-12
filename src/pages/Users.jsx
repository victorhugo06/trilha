// src/pages/AdminPanel.jsx
import { Calendar, BarChart, Users2Icon, ClipboardList, Settings, LogOut, X, MenuIcon, Edit, PlusIcon } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useUser } from "../context/UserContext";


const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser(); // Obtém o usuário logado

  const isActive = (path) => location.pathname === path;

  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar se está retraído
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: ""
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const apiBaseUrl = "http://localhost:5000/api/users"; // URL base da API para usuários

   // Buscar usuários no backend
   useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiBaseUrl);
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      type: user?.type || "",
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.email || !formData.type) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    try {
      if (selectedUser) {
        // Atualizar usuário existente
        await axios.put(`${apiBaseUrl}/${selectedUser._id}`, formData);
        toast.success('Usuário atualizado com sucesso.');
      } else {
        // Criar novo usuário
        await axios.post(apiBaseUrl, formData);
        toast.success('Usuário criado com sucesso.');
      }
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      toast.error('Error ao criar usuário.');
      console.log(error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      toast.success('Usuário deletado com sucesso.');
      fetchUsers();
    } catch (error) {
      toast.error('Error ao atualizar o usuário.');
      console.error("Erro ao excluir usuário:", error);
    }
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
          <h1 className="text-2xl font-bold mb-4">Usuários</h1>
            <button
              className="bg-green-500 text-white py-2 px-4 mb-4 flex items-center gap-2"
              onClick={() => handleOpenModal()}
            >
             < PlusIcon size={24} />Novo Usuário
            </button>

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nome</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Tipo</th>
                  <th className="border p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.type === 'P' ? 'Paciente' : user.type === 'A' ? 'Atendente' : user.type}</td>
                    <td className="border p-2 flex">
                      <button
                        className="bg-yellow-500 text-white px-3 py-2 mr-1 rounded flex items-center gap-2"
                        onClick={() => handleOpenModal(user)}
                      >
                        < Edit size={20} />
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-2 mr-1 rounded flex items-center gap-2"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        < X size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg">
                <h3 className="text-xl font-bold mb-4">
                  {selectedUser ? "Editar Usuário" : "Criar Usuário"}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded max-h-20"
                    >
                      <option value=''>Selecione o tipo...</option>
                      <option value='P'>Paciente</option>
                      <option value='A'>Atentende</option>
                    </select>
                  {!selectedUser && (
                    <input
                      type="password"
                      placeholder="Senha"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  )}
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded"
                    onClick={handleFormSubmit}
                  >
                    {selectedUser ? "Atualizar" : "Criar"}
                  </button>
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

export default Users;
