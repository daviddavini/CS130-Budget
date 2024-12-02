import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error('Invalid token in localStorage', e);
        localStorage.removeItem('token');
      }
    }
  }, []);
    const login = (credential, method) => {
	if (method === 'google') {
	    const decoded = jwtDecode(credential);
	    setUser(decoded);
	} else if (method === 'manual') {
	    const defaultUser = {
		picture: '',
	    }
	    setUser(defaultUser);
	}
	localStorage.setItem('token', credential);

  };

  const logout = () => {
    setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
