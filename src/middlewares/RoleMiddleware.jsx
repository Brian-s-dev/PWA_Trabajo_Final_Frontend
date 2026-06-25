import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

const RoleMiddleware = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.rol)) {
        // Redirige al dashboard del empleado si no tiene permisos
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RoleMiddleware;
