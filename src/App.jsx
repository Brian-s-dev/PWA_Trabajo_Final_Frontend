import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import VerifyEmailScreen from './Screens/VerifyEmailScreen';
import DashboardScreen from './Screens/DashboardScreen';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/verify-email" element={<VerifyEmailScreen />} />
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;