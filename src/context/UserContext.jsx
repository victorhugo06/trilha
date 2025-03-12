import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importando PropTypes


const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Tenta carregar o usuário salvo no localStorage ao iniciar
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]); // Atualiza sempre que `user` mudar

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Definindo a validação das props
UserProvider.propTypes = {
  children: PropTypes.node.isRequired, // children deve ser um nó React e é obrigatório
};

export const useUser = () => useContext(UserContext);
