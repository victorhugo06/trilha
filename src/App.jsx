// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import Agenda from "./components/Agenda";
import Dashboard from "./components/Dashboard";
import Pacientes from "./components/Pacientes";
import Usuarios from "./components/Usuarios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { ToastContainer } from "react-toastify";  // Importa o ToastContainer

function App() {
  const [user] = useAuthState(auth); // Verifica se o usuário está autenticado

  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas Privadas */}
        <Route
          path="/admin"
          element={user ? <AdminPanel /> : <Navigate to="/login" />}
        />
        <Route
          path="/agenda"
          element={user ? <Agenda /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboards"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/pacientes"
          element={user ? <Pacientes /> : <Navigate to="/login" />}
        />
        <Route
          path="/usuarios"
          element={user ? <Usuarios /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* Componente ToastContainer para mostrar as notificações */}
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
    </Router>
  );
}

export default App;
