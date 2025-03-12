import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Erro ao enviar solicitação.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex">
      <div className="forgot-password bg-orange-200 max-w-sm max-h-60 mx-auto my-40 mt-40 p-6 flex-grow rounded-lg shadow-lg py-4 flex-col">
        <div className="text-center font-bold text-2xl mb-4">
          <h2 className='text-orange-400'>Esqueci minha senha</h2>
        </div>
        <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Insira seu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          <button
            type="submit"
            className="mt-4 p-2 text-slate-100 hover:bg-sky-500 w-full bg-sky-400 border rounded-md"
          >
            Enviar
          </button>
          <button
          onClick={() => navigate('/login')}
          className="mt-4 p-2 text-blue-500 hover:bg-slate-200 w-full bg-slate-50 border rounded-md"
          >
          Voltar
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
