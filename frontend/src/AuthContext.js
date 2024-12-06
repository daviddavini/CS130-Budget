import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

/**
 * The AuthContext provides user authentication state and operations.
 * It gives access to the current user object and login/logout functions.
 */
export const AuthContext = createContext();

/**
 * The AuthProvider component manages user authentication state and provides it
 * to all children via the AuthContext. It handles token decoding, login, and logout.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components that require authentication state.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * On mount, the AuthProvider attempts to retrieve a token from localStorage.
     * If a valid token is found, it decodes it and sets the user state.
     * If invalid, it removes the token.
     */
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

  /**
   * Logs the user in by decoding the provided credential if using Google auth,
   * or setting a default user object if manually authenticated.
   * 
   * @param {string} credential - The token or credential to store and decode.
   * @param {'google'|'manual'} method - The login method used.
   */
  const login = (credential, method) => {
    if (method === 'google') {
      const decoded = jwtDecode(credential);
      setUser(decoded);
    } else if (method === 'manual') {
      const defaultUser = {
        picture: '',
      };
      setUser(defaultUser);
    }
    localStorage.setItem('token', credential);
  };

  /**
   * Logs the user out by clearing the current user state and removing the token from localStorage.
   * It then redirects to the '/login' route.
   */
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
