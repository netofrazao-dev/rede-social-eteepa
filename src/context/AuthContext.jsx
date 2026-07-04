import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, tenta restaurar a sessão salva (token + usuário)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('eetepa_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Faz login de verdade na API. Guarda o token (usado pelo api.js em toda
  // requisição) e os dados do usuário.
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('eetepa_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      // Repassa a mensagem amigável que veio do backend (ex: "E-mail ou senha
      // inválidos."). Se o servidor estiver fora do ar, avisa disso.
      const msg =
        err.response?.data?.error ||
        'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('eetepa_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
