import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Menu as MenuIcon, X, Calendar, BarChart, ClipboardList, Settings, Users2Icon, LogOut } from "lucide-react";

const SidebarNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("auth_token");
        logout();
        navigate("/login");
      } else {
        throw new Error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  return (
    <>
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
        className={`fixed top-0 left-0 h-full max-w-40 bg-sky-400 text-white flex flex-col items-center py-4 transition-transform duration-200 z-60 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ width: "240px" }}
      >
        <button
          className="self-end mr-2 bg-orange-400 text-white p-2 rounded-full"
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
          <button className="py-2 px-4 text-left hover:bg-blue-600 w-full flex items-center gap-2" onClick={() => navigate("/events")}>
            <Calendar size={18} /> Agenda
          </button>
          <button className="py-2 px-4 text-left hover:bg-blue-600 w-full flex items-center gap-2" onClick={() => navigate("/dashboards")}>
            <BarChart size={18} /> Dashboards
          </button>
          <button className="py-2 px-4 text-left hover:bg-blue-600 w-full flex items-center gap-2" onClick={() => navigate("/patients")}>
            <ClipboardList size={18} /> Pacientes
          </button>
          <button className="py-2 px-4 text-left hover:bg-blue-600 w-full flex items-center gap-2" onClick={() => navigate("/services")}>
            <Settings size={18} /> Planos
          </button>
          <button className="py-2 px-4 text-left hover:bg-blue-600 w-full flex items-center gap-2" onClick={() => navigate("/users")}>
            <Users2Icon size={18} /> Usuários
          </button>
        </nav>

        {/* Botão de Logout */}
        <button className="text-white mt-auto py-2 px-4 w-full flex items-center gap-2" onClick={handleLogout}>
          <LogOut size={18} /> Sair
        </button>
      </aside>
    </>
  );
};

export default SidebarNav;
