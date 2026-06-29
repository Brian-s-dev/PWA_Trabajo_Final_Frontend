import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { getAllUsersService, deleteUserService, updateUserService } from '../../../services/user.service';
import ConfirmModal from '../../../Components/ConfirmModal/ConfirmModal';
import { UserPlus, Settings, Trash2, GraduationCap, ArrowLeft, RefreshCw } from 'lucide-react';
import '../AdminTables/AdminTables.css';
import './ManageUsersScreen.css';

const ManageUsersScreen = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isHardDelete, setIsHardDelete] = useState(false);

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [userToChangeRole, setUserToChangeRole] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsersService(true);
                setUsers(response.data || []);
            } catch (error) {
                console.error(error);
                alert('Error cargando usuarios: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const renderRoleBadge = (role) => {
        if (role === 'SUPERADMIN') return <span className="badge blue">SuperAdmin</span>;
        if (role === 'ADMIN') return <span className="badge green">Admin</span>;
        return <span className="badge role-employee">Empleado</span>;
    };

    const requestDelete = (id, hard = false) => {
        setUserToDelete(id);
        setIsHardDelete(hard);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await deleteUserService(userToDelete, isHardDelete);
            if (isHardDelete) {
                setUsers(users.filter(u => u._id !== userToDelete));
            } else {
                setUsers(users.map(u => u._id === userToDelete ? { ...u, activo: false } : u));
            }
        } catch (error) {
            alert('Error eliminando usuario: ' + error.message);
        }
    };

    const reactivateUser = async (id) => {
        try {
            await updateUserService(id, { activo: true });
            setUsers(users.map(u => u._id === id ? { ...u, activo: true } : u));
        } catch (error) {
            alert('Error reactivando usuario: ' + error.message);
        }
    };

    const requestRoleChange = (user) => {
        setUserToChangeRole(user);
        setNewRole(user.rol);
        setIsRoleModalOpen(true);
    };

    const confirmRoleChange = async () => {
        if (!userToChangeRole) return;
        try {
            await updateUserService(userToChangeRole._id, { rol: newRole });
            setUsers(users.map(u => u._id === userToChangeRole._id ? { ...u, rol: newRole } : u));
            setIsRoleModalOpen(false);
        } catch (error) {
            alert('Error actualizando rol: ' + error.message);
        }
    };

    return (
        <div className="screen-container">
            <div className="admin-panel-container">
                <div className="admin-panel-header">
                    <div className="flex-center-gap-16">
                        <Link to="/admin" className="btn-icon" title="Volver al Panel">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="admin-panel-title">Gestión de Usuarios</h1>
                    </div>
                    <Link to="/admin/users/new" className="btn-primary">
                        <UserPlus size={16} /> Crear Usuario
                    </Link>
                </div>

                <div className="admin-table-wrapper">
                    {loading ? (
                        <div className="empty-state-padding">Cargando usuarios...</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className={!user.activo ? "mu-row-inactive" : ""}>
                                        <td>
                                            <div className="table-user-name">
                                                {user.nombre}
                                                {!user.activo && <span className="badge inactive-badge">Inactivo</span>}
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{renderRoleBadge(user.rol)}</td>
                                        <td>
                                            <div className="table-actions">
                                                <Link to={`/admin/assign/${user._id}`} className="btn-icon edit" title="Asignar Cursos">
                                                    <GraduationCap size={18} />
                                                </Link>
                                                <button onClick={() => requestRoleChange(user)} className="btn-icon edit" title="Modificar Rol">
                                                    <Settings size={18} />
                                                </button>
                                                {currentUser?._id !== user._id && !(user.rol === 'SUPERADMIN' && currentUser?.rol !== 'SUPERADMIN') && (
                                                    <>
                                                        {user.activo !== false ? (
                                                            <button onClick={() => requestDelete(user._id, false)} className="btn-icon delete" title="Desactivar (Soft Delete)">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => reactivateUser(user._id)} className="btn-icon reactivate-btn" title="Reactivar Usuario">
                                                                <RefreshCw size={18} />
                                                            </button>
                                                        )}
                                                        {currentUser?.rol === 'SUPERADMIN' && (
                                                            <button onClick={() => requestDelete(user._id, true)} className="btn-icon delete" title="Eliminar Definitivamente (Hard Delete)">
                                                                <Trash2 size={18} fill="currentColor" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="empty-state-padding">
                                            No hay usuarios registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={isHardDelete ? "Eliminar Usuario Físicamente" : "Desactivar Usuario"}
                message={isHardDelete
                    ? "ATENCIÓN: Estás a punto de ELIMINAR FÍSICAMENTE a este usuario. Esta acción borrará al usuario y todas sus inscripciones asociadas de la base de datos de manera irreversible. ¿Estás seguro?"
                    : "¿Estás seguro que deseas desactivar a este usuario? Perderá el acceso al sistema."}
                confirmText={isHardDelete ? "Eliminar Definitivamente" : "Desactivar"}
            />

            {isRoleModalOpen && userToChangeRole && (
                <div className="confirm-modal-overlay" onClick={() => setIsRoleModalOpen(false)}>
                    <div className="confirm-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="confirm-modal-close" onClick={() => setIsRoleModalOpen(false)}>
                            <Settings size={20} />
                        </button>

                        <h3 className="confirm-modal-title">Cambiar Rol de Usuario</h3>
                        <p className="confirm-modal-message mb-16">
                            Modificando el rol de <strong>{userToChangeRole.nombre}</strong> ({userToChangeRole.email})
                        </p>

                        <div className="mb-24">
                            <label className="form-label text-left">
                                Seleccionar Nuevo Rol
                            </label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="form-input"
                            >
                                <option value="EMPLOYEE">Empleado</option>
                                <option value="ADMIN">Administrador (Admin)</option>
                            </select>
                        </div>

                        <div className="confirm-modal-actions">
                            <button className="btn-secondary" onClick={() => setIsRoleModalOpen(false)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={confirmRoleChange}>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsersScreen;
