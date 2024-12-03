// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ token: null, role: null });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Define prop types for AuthProvider
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Specify that children is required and can be any renderable node
};

export const useAuth = () => useContext(AuthContext);
