import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

const AuthMiddleware = () => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};

export default AuthMiddleware;