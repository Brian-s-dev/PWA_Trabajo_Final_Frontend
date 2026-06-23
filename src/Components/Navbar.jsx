import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <h2>LMS Onboarding</h2>
            <ul>
                {!user ? (
                    <>
                        <li><Link to="/">Iniciar Sesión</Link></li>
                        <li><Link to="/register">Registro</Link></li>
                    </>
                ) : (
                    <>
                        {(user.rol === 'ADMIN' || user.rol === 'SUPERADMIN') && (
                            <li><Link to="/admin">Panel de Administración</Link></li>
                        )}
                        <li><Link to="/dashboard">Mis Cursos</Link></li>
                        <li>
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
