// src/pages/AdminPanel.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Calendar, BarChart, ClipboardList, Settings, LogOut, X, MenuIcon, Users2Icon } from "lucide-react";
import { useUser } from "../context/UserContext";


const Dashboards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { user, setUser } = useUser(); // Obtém o usuário logado
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar se está retraído
  

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
        {/* Nome do usuário (opcional) */}
          <h1 className="text-2xl font-bold mb-4">Bem vindo(a)!</h1>
          <p className="text-gray-600">Selecione uma opção no menu lateral.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboards;
