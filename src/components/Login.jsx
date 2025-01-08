// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase"; // Configuração do Firebase
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Estilos do React Toastify


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Provedor do Google
  const googleProvider = new GoogleAuthProvider();

  // Login com email e senha
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login bem-sucedido!");  // Mensagem de sucesso
      navigate("/admin"); // Redireciona para a página administrativa
    } catch (err) {
      toast.error("Credenciais inválidas. Tente novamente.");  // Mensagem de erro
    }
  };

  // Login com Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Login com Google bem-sucedido!");  // Mensagem de sucesso
      navigate("/admin"); // Redireciona para a página administrativa
    } catch (err) {
      toast.error("Erro ao autenticar com o Google. Tente novamente.");  // Mensagem de erro
    }
  };

  // Função para voltar à landing page
  const handleBackToHome = () => {
    navigate("/"); // Redireciona para a landing page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-400">
      {/* Botão para voltar à Landing Page */}
      <button 
        onClick={handleBackToHome} 
        className="absolute top-4 left-4 px-5 py-3 bg-orange-400 text-white hover:text-gray-600 mb-4"
      >
        Voltar
      </button>
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-900">Login - Trilha</h1>
        {/* Formulário de Login */}
        <form onSubmit={handleEmailLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">Ou</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
