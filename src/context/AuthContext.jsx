// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api, { axiosInstance } from '../api/axiosInstance';

const AuthContext = createContext();

const USE_BACKEND = false;

const mockUser = {
  _id: 'u1',
  name: 'Admin Bongani',
  email: 'admin@school.edu',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(USE_BACKEND ? null : mockUser);

  const fetchUser = async () => {
    if (!USE_BACKEND) return;

    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch user:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    if (!USE_BACKEND) return;

    const token = localStorage.getItem('token');
    if (token && axiosInstance.defaults?.headers?.common) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchUser();
  }, []);

  const login = async (email, password) => {
    if (!USE_BACKEND) {
      console.warn('🧪 Offline mode: simulating login.');
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('userRole', mockUser.role);
      setUser(mockUser);
      return;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);

      if (axiosInstance.defaults?.headers?.common) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      }

      setUser(res.data.user);
    } catch (err) {
      console.error('❌ Login failed:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    if (axiosInstance.defaults?.headers?.common) {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }

    setUser(USE_BACKEND ? null : mockUser); // Reset to mock user in offline mode
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);