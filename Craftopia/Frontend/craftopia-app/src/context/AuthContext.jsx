
import React, { createContext, useContext, useState, useEffect } from 'react';

// Simple JWT payload decoder without external library
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decodedJson = window.atob(payload);
    return JSON.parse(decodedJson);
  } catch {
    return {};
  }
}

// Create the Auth context
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check for existing token
useEffect(() => {
  const handleStorageChange = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    const decoded = decodeJWT(token);
    if (decoded.exp && decoded.exp * 1000 > Date.now()) {
      setUser({
        id: decoded.id || decoded.sub,
        email: decoded.email,
        role: decoded.role
      });
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  handleStorageChange(); // run once on mount

  // Listen to token changes across tabs or internal updates
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);


  // Login: store token and decode user
  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = decodeJWT(token);
    setUser({
      id: decoded.id || decoded.sub,
      email: decoded.email,
      role: decoded.role
    });
  };

  // Logout: remove token and clear user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => useContext(AuthContext);