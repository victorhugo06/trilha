// src/pages/AdminPanel.jsx
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Dashboard = () => {
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
      <aside className="w-64 bg-blue-700 text-white flex flex-col items-center py-8">
        {/* Foto do usuário */}
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
          {/* Ícone de usuário ou foto */}
          <img
            src="https://via.placeholder.com/150"
            alt="Usuário"
            className="rounded-full"
          />
        </div>

        {/* Nome do usuário (opcional) */}
        <h2 className="text-lg font-bold mb-8">Bem-vindo!</h2>

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
          className="mt-auto py-2 px-4 bg-red-600 hover:bg-red-500 rounded w-3/4"
          onClick={handleLogout}
        >
          Sair
        </button>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
        <p className="text-gray-600">Dashboard.</p>
      </main>
    </div>
  );
};

export default Dashboard;
