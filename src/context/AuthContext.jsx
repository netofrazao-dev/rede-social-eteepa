import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  'admin@eetepa.edu.br': {
    email: 'admin@eetepa.edu.br',
    name: 'Glauber Souza',
    role: 'admin',
    roleLabel: 'Diretor Geral',
    avatar: '', // triggers initials fallback
    postCount: 15,
  },
  'teacher@eetepa.edu.br': {
    email: 'teacher@eetepa.edu.br',
    name: 'Prof. Marcos Silva',
    role: 'teacher',
    roleLabel: 'Prof. de Informática',
    avatar: '', // triggers initials fallback
    postCount: 8,
  },
  'leader@eetepa.edu.br': {
    email: 'leader@eetepa.edu.br',
    name: 'Amanda Costa',
    role: 'leader',
    roleLabel: 'Líder do 3º Info',
    avatar: '', // triggers initials fallback
    postCount: 12,
  },
  'student@eetepa.edu.br': {
    email: 'student@eetepa.edu.br',
    name: 'Thiago Rocha',
    role: 'student',
    roleLabel: 'Aluno de Informática',
    avatar: '', // triggers initials fallback
    postCount: 3,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('eetepa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanedEmail = email.toLowerCase().trim();
        const foundUser = MOCK_USERS[cleanedEmail];
        
        if (foundUser) {
          localStorage.setItem('eetepa_user', JSON.stringify(foundUser));
          setUser(foundUser);
          resolve(foundUser);
        } else {
          reject(new Error('Usuário inválido. Use: admin, teacher, leader ou student (@eetepa.edu.br)'));
        }
      }, 600); // premium short delay for native feel
    });
  };

  const logout = () => {
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
export { MOCK_USERS };
