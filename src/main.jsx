// src/index.js (ou src/main.jsx, dependendo da configuração)
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importando BrowserRouter
import App from './App'; // ou o arquivo que envolve a navegação
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter> {/* Envolvendo a aplicação com BrowserRouter */}
    <App />
  </BrowserRouter>
);
