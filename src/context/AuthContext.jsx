import { createContext, useContext, useEffect, useState } from 'react';
import api, { axiosInstance } from '../api/axiosInstance';
// Optional: Uncomment if you want to validate token expiry
// import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

const USE_BACKEND = false; // Toggle backend mode

const mockUser = {
  _id: 'u1',
  name: 'Admin Bongani',
  email: 'admin@school.edu',
  role: 'admin',
};

// Optional: Token expiry validation
// const isTokenValid = (token) => {
//   try {
//     const { exp } = jwtDecode(token);
//     return Date.now() < exp * 1000;
//   } catch {
//     return false;
//   }
// };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(USE_BACKEND ? null : mockUser);
  const [loading, setLoading] = useState(USE_BACKEND); // Optional: loading state
  const [authError, setAuthError] = useState(null); // Optional: expose login error

  const fetchUser = async () => {
    if (!USE_BACKEND) return;

    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setAuthError(null);
    } catch (err) {
      console.error('❌ Failed to fetch user:', err);
      setUser(null);
      setAuthError('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!USE_BACKEND) return;

    const token = localStorage.getItem('token');

    // Optional: validate token before trusting it
    // if (!token || !isTokenValid(token)) {
    //   console.warn('⚠️ Invalid or expired token');
    //   setUser(null);
    //   setLoading(false);
    //   return;
    // }

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
      setAuthError(null);
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
      setAuthError(null);
    } catch (err) {
      console.error('❌ Login failed:', err);
      setUser(null);
      setAuthError('Invalid credentials');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    if (axiosInstance.defaults?.headers?.common) {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }

    setUser(USE_BACKEND ? null : mockUser);
    setAuthError(null);
  };

  // Optional: Role-based flags
  const role = user?.role;
  const isAdmin = role === 'admin';
  const isFaculty = role === 'faculty';
  const isLearner = role === 'learner';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,       // Optional: use to block UI while fetching
        authError,     // Optional: display login errors
        isAdmin,       // Optional: role-based access
        isFaculty,
        isLearner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);