import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/B.E.S.T-LMS-OFFLINE">
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);