// src/components/Header.jsx
import PropTypes from 'prop-types'; // Importando PropTypes

function Header({ onPageChange }) {
  return (
    <header>
      <button onClick={() => onPageChange('home')}>Home</button>
      <button onClick={() => onPageChange('login')}>Login</button>
    </header>
  );
}

// Validando a prop 'onPageChange'
Header.propTypes = {
  onPageChange: PropTypes.func.isRequired, // 'onPageChange' deve ser uma função obrigatória
};

export default Header;
