import { useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.success('As senhas são diferentes.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        token,
        password,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error('erro ao redefinir sua senha.');
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex">
      <div className="forgot-password bg-orange-200 max-w-sm max-h-60 mx-auto my-40 mt-40 p-6 flex-grow rounded-lg shadow-lg py-4 flex-col">
        <div className="text-center font-bold text-2xl mb-4">
          <h2 className='text-orange-400'>Redefinir senha</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              placeholder="Insira a nova senha"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              value={confirmPassword}
              placeholder="Confirmar senha"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          <button 
            type="submit" 
            className="mt-10 p-2 text-slate-50 hover:bg-sky-500 w-full bg-sky-400 border rounded-md"
          >
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
