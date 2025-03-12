// src/pages/Login.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LogOut, LogIn } from "lucide-react";
import { useUser } from "../context/UserContext";

const Login = () => {
  const { setUser } = useUser(); // Obtém a função para atualizar o usuário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
  
      // Enviar requisição de login
      const response = await api.post('/login', { email, password });
  
      // Sucesso
      if (response.status === 200) {
        // Login bem-sucedido
        toast.success('Login bem-sucedido!');

        // Armazenar o token ou outro dado retornado no localStorage (se necessário)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Salva no localStorage
        setUser(response.data.user); // Atualiza o contexto do usuário

        // Redirecionar para o painel da aplicação
        navigate('/panel');
      } else {
        // Exibir erro
        toast.error('Credenciais inválidas!');
      }
    } catch (error) {
      // Erro ao fazer login
      if (error.response && error.response.data) {
        toast.error(`Erro: ${error.response.data.message || 'Ocorreu um erro.'}`);
      } else {
        toast.error('Erro: Ocorreu um problema na conexão.');
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <div className="bg-orange-200 max-w-sm mx-auto my-20 mt-10 p-6 flex-grow rounded-lg shadow-lg py-4">
        <div className="text-center font-bold text-3xl mb-4">
          <h2 className='text-gray-700'>Sistema - Trilha</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-s-4 border-sky-400 rounded-md"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-s-4 border-sky-400 rounded-md"
          />
          <button type="submit" className="w-full py-3 bg-sky-400 hover:bg-sky-500 text-white rounded-md flex items-center gap-2 justify-center">
          < LogIn size={20} /> Entrar
          </button>
        </form>
        <p className="mt-4 text-center">
          Esqueceu sua senha?{' '}
          <button
            onClick={() => navigate('/forgot-password')}
            className="ml-1 text-blue-500 hover:text-blue-700"
          >
            Resetar senha
          </button>
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 p-2 text-blue-500 hover:bg-slate-200 w-full bg-slate-50 border rounded-md flex items-center gap-2 justify-center"
        >
          < LogOut size={20} /> Sair
        </button>
      </div>
      <div>
        <footer className="text-center text-lg text-gray-700 bg-orange-200 py-2 mt-auto">
          <p>&copy; 2025 - Trilha. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default Login;
