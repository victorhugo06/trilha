// src/pages/AdminPanel.jsx
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-sky-400 shadow-md px-4 text-white flex flex-col items-center py-8">
        {/* Foto do usuário */}
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
          {/* Ícone de usuário ou foto */}
          <img
            src="https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-business-men-icon-png-image_4186858.jpg"
            alt="Usuário"
            className="rounded-full"
          />
        </div>
        {/* Menu de opções */}
        <nav className="flex flex-col w-full">
          <button
            className="py-3 px-4 text-left hover:bg-blue-600 w-full"
            onClick={() => navigate("/agenda")}
          >
            Agenda
          </button>
          <button
            className="py-3 px-4 text-left hover:bg-blue-600 w-full"
            onClick={() => navigate("/dashboards")}
          >
            Dashboards
          </button>
          <button
            className="py-3 px-4 text-left hover:bg-blue-600 w-full"
            onClick={() => navigate("/pacientes")}
          >
            Pacientes
          </button>
          <button
            className="py-3 px-4 text-left hover:bg-blue-600 w-full"
            onClick={() => navigate("/usuarios")}
          >
            Usuários
          </button>
        </nav>

        {/* Botão de Logout */}
        <button
          className="mt-auto py-2 px-4 bg-orange-400 hover:bg-orange-500 rounded w-3/4"
          onClick={handleLogout}
        >
          Sair
        </button>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8">
        {/* Nome do usuário (opcional) */}
        <h1 className="text-2xl font-bold mb-4">Bem vindo(a)!</h1>
        <p className="text-gray-600">Selecione uma opção no menu lateral.</p>
      </main>
    </div>
  );
};

export default AdminPanel;