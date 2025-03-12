// src/pages/Register.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação simples dos campos
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      // Enviar os dados para a API de registro
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        // Exibir notificação de sucesso
        toast.success('Conta criada com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login'); // Usando React Router para redirecionar
        }, 2000);
      } else {
        toast.error(response.data.message || 'Ocorreu um erro ao criar a conta.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao processar sua solicitação.');
      console.error('Erro ao criar conta:', error);
    }
  };

  return (
    <div className="register-container">
      <h1>Criar nova conta</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>

        <div>
          <label>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <div>
          <label>Confirmar Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
          />
        </div>

        <button type="submit">Criar Conta</button>
      </form>
        <button onClick={() => navigate('/login')}>Voltar</button>
    </div>
  );
}

export default Register;
