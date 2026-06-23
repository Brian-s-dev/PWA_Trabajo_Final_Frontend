import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboardScreen = () => {
    const { user } = useAuth();

    if (user.rol !== 'ADMIN' && user.rol !== 'SUPERADMIN') {
        return <h1>Acceso Denegado</h1>;
    }

    return (
        <div>
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {user.nombre}. Rol: {user.rol}</p>

            <section>
                <h2>Gestión de Cursos</h2>
                <p>Aquí se listarán y crearán los cursos.</p>
                {/* TODO: Implementar lista de cursos usando course.service */}
            </section>

            <section>
                <h2>Gestión de Usuarios</h2>
                <p>Aquí se gestionarán los empleados y sus asignaciones.</p>
                {/* TODO: Implementar lista de usuarios usando user.service */}
            </section>
        </div>
    );
};

export default AdminDashboardScreen;
