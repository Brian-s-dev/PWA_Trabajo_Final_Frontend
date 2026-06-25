import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import AuthMiddleware from './middlewares/AuthMiddleware';
import AlreadyAuthMiddleware from './middlewares/AlreadyAuthMiddleware';
import RoleMiddleware from './middlewares/RoleMiddleware';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import VerifyEmailScreen from './Screens/VerifyEmailScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import DashboardScreen from './Screens/DashboardScreen';
import CourseDetailScreen from './Screens/CourseDetailScreen';
import ModuleContentScreen from './Screens/ModuleContentScreen';
import AdminDashboardScreen from './Screens/AdminDashboardScreen';
import ManageCoursesScreen from './Screens/ManageCoursesScreen';
import CourseEditorScreen from './Screens/CourseEditorScreen';
import ManageUsersScreen from './Screens/ManageUsersScreen';
import UserEditorScreen from './Screens/UserEditorScreen';
import AssignCoursesScreen from './Screens/AssignCoursesScreen';
import Navbar from './Components/Navbar';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<AlreadyAuthMiddleware />}>
            <Route
              path="/"
              element={<LoginScreen />}
            />
            <Route
              path="/register"
              element={<RegisterScreen />}
            />
            <Route
              path="/verify-email"
              element={<VerifyEmailScreen />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordScreen />}
            />
            <Route
              path="/reset-password"
              element={<ResetPasswordScreen />}
            />
          </Route>
          <Route element={<AuthMiddleware />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/course/:id" element={<CourseDetailScreen />} />
            <Route path="/course/:id/module/:moduleId" element={<ModuleContentScreen />} />
          </Route>
          <Route element={<RoleMiddleware allowedRoles={['ADMIN', 'SUPERADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardScreen />} />
            <Route path="/admin/courses" element={<ManageCoursesScreen />} />
            <Route path="/admin/courses/new" element={<CourseEditorScreen />} />
            <Route path="/admin/courses/:courseId" element={<CourseEditorScreen />} />
            <Route path="/admin/users" element={<ManageUsersScreen />} />
            <Route path="/admin/users/new" element={<UserEditorScreen />} />
            <Route path="/admin/assign/:userId" element={<AssignCoursesScreen />} />
          </Route>
          <Route
            path="*"
            element={
              <div className="screen-container" style={{ textAlign: 'center', padding: '100px 0' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>404 - Página no encontrada</h1>
                <p style={{ color: 'var(--text-muted)' }}>La sección que estás buscando no existe.</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;