import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import PropTypes from "prop-types"; // Importando PropTypes


const ProtectedRoute = ({ children }) => {
  const { user } = useUser();

  return user ? children : <Navigate to="/login" />;
};

// Definindo a validação das props
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children deve ser um nó React e é obrigatório
};

export default ProtectedRoute;
