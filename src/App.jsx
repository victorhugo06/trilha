// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Importando o Contexto do Usuário
import ProtectedRoute from './components/ProtectedRoute'; // Importando o Componente de Proteção
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdmPanel from './pages/AdmPanel';
import Events from './pages/Events';
import Users from './pages/Users';
import Patients from './pages/Patients';
import Services from './pages/Services';
import Dashboards from './pages/Dashboards';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ReminderControl from './pages/ReminderControl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <UserProvider> {/* Envolvendo a aplicação com o Contexto do Usuário */}
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Rotas Protegidas */}
          <Route path="/panel" element={<ProtectedRoute><AdmPanel /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/dashboards" element={<ProtectedRoute><Dashboards /></ProtectedRoute>} />
          <Route path="/remindercontrol" element={<ProtectedRoute><ReminderControl /></ProtectedRoute>} />
        </Routes>
        <ToastContainer />
    </UserProvider>
  );
}

export default App;
