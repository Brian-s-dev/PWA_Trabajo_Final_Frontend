import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyCoursesService } from '../../services/enrollment.service';
import { updateMeService, uploadAvatarService } from '../../services/auth.service';
import ENVIRONMENT from '../../config/environment';
import { ENROLLMENT_STATUS } from '../../constants/enrollmentStatus';
import AnimatedSaveButton from "../AnimatedSaveButton/AnimatedSaveButton";
import { X, Camera, Edit2, LogOut, Save, ShieldAlert } from 'lucide-react';
import './ProfileSidebar.css';

const ProfileSidebar = ({ isOpen, onClose }) => {
    const { user, logout, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({ assigned: 0, completed: 0, progress: 0 });

    const [formData, setFormData] = useState({ nombre: '', newPassword: '', confirmPassword: '' });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [successProfile, setSuccessProfile] = useState(false);

    const [loadingPassword, setLoadingPassword] = useState(false);
    const [successPassword, setSuccessPassword] = useState(false);

    const [error, setError] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({ nombre: user.nombre, newPassword: '', confirmPassword: '' });
        }
        setError(null);
    }, [isEditing, user]);

    useEffect(() => {
        if (isOpen && user && user.rol === 'EMPLOYEE') {
            const fetchStats = async () => {
                try {
                    const res = await getMyCoursesService();
                    const enrollments = res.data || [];
                    const assigned = enrollments.length;
                    const completed = enrollments.filter(e => e.estado === ENROLLMENT_STATUS.COMPLETADO).length;
                    const progress = assigned === 0 ? 0 : Math.round((completed / assigned) * 100);

                    setStats({ assigned, completed, progress });
                } catch (error) {
                    console.error("Error fetching stats:", error);
                }
            };
            fetchStats();
        }
    }, [isOpen, user]);

    if (!isOpen || !user) return null;

    const handleLogout = () => {
        logout();
        onClose();
        window.location.href = '/';
    };

    const handleUpdateProfile = async () => {
        setError(null);
        try {
            setLoadingProfile(true);
            const res = await updateMeService({ nombre: formData.nombre });
            updateUser({ nombre: res.data.nombre });

            setSuccessProfile(true);
            setTimeout(() => {
                setSuccessProfile(false);
                setIsEditing(false);
            }, 1000);

        } catch (err) {
            setError(err.message);
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        setError(null);
        if (!formData.newPassword) {
            setError("Debes ingresar una contraseña");
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoadingPassword(true);
            await updateMeService({ password: formData.newPassword });

            setSuccessPassword(true);
            setTimeout(() => {
                setSuccessPassword(false);
                setFormData({ ...formData, newPassword: '', confirmPassword: '' });
                setIsEditing(false);
            }, 1000);

        } catch (err) {
            setError(err.message);
            setLoadingPassword(false);
        }
    };
    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);
            setError(null);
            const res = await uploadAvatarService(file);
            updateUser({ avatar: res.data.avatar });
        } catch (err) {
            setError(err.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <div className="sidebar-overlay" onClick={onClose}>
            <div className={`sidebar-container ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="sidebar-header">
                    {isEditing ? (
                        <>
                            <button className="btn-icon" onClick={() => setIsEditing(false)}>
                                <X size={20} />
                            </button>
                            <h3>Editar Perfil</h3>
                            <AnimatedSaveButton
                                isSaving={loadingProfile}
                                isSuccess={successProfile}
                                onClick={handleUpdateProfile}
                                defaultText="Confirmar"
                                savingText="Guardando..."
                                className="btn-text primary"
                                style={{ minWidth: 'auto', background: 'transparent' }}
                            />
                        </>
                    ) : (
                        <>
                            <button className="btn-text" onClick={onClose}>
                                {'< Volver'}
                            </button>
                            <h3>Mi Perfil</h3>
                            <button className="btn-icon" onClick={() => setIsEditing(true)}>
                                <Edit2 size={18} />
                            </button>
                        </>
                    )}
                </div>

                <div className="sidebar-content">
                    {isEditing ? (
                        <div className="edit-profile-section">
                            <div className="avatar-edit">
                                <div className="avatar-large" onClick={handleAvatarClick} style={{ cursor: 'pointer', overflow: 'hidden' }}>
                                    {uploadingAvatar ? (
                                        <span style={{ fontSize: '14px' }}>⏳</span>
                                    ) : user.avatar ? (
                                        <img
                                            src={user.avatar.startsWith('http') ? user.avatar : `${ENVIRONMENT.URL_API.replace('/api', '')}${user.avatar}`}
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        user.nombre.charAt(0).toUpperCase()
                                    )}
                                    <div className="avatar-upload-badge">
                                        <Camera size={14} />
                                    </div>
                                </div>
                                <div className="avatar-actions">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        className="btn-secondary small"
                                        onClick={handleAvatarClick}
                                        disabled={uploadingAvatar}
                                    >
                                        {uploadingAvatar ? 'Subiendo...' : 'Subir nueva imagen'}
                                    </button>
                                </div>
                            </div>

                            <hr className="divider" />

                            {error && <div style={{ color: 'var(--danger-color)', fontSize: '13px', marginBottom: '16px', padding: '8px', backgroundColor: 'var(--danger-light)', borderRadius: '6px' }}>{error}</div>}

                            <div className="form-group">
                                <h3>📝 Datos Personales</h3>
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="input-styled"
                                />

                                <label style={{ marginTop: '12px' }}>Email (No editable)</label>
                                <input type="text" value={user.email} disabled className="input-styled disabled" />

                                <label style={{ marginTop: '12px' }}>Fecha de Alta (No editable)</label>
                                <input type="text" value={new Date(user.createdAt || Date.now()).toLocaleDateString()} disabled className="input-styled disabled" />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                                    <div>
                                        <label>Cursos Asignados</label>
                                        <input type="text" value={stats.assigned} disabled className="input-styled disabled" />
                                    </div>
                                    <div>
                                        <label>Cursos Completados</label>
                                        <input type="text" value={stats.completed} disabled className="input-styled disabled" />
                                    </div>
                                </div>
                            </div>

                            <hr className="divider" />

                            <div className="form-group">
                                <h3>🔒 Seguridad y Contraseña</h3>

                                <label>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-styled"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />

                                <label style={{ marginTop: '12px' }}>Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-styled"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />

                                <div style={{ marginTop: '24px' }}>
                                    <AnimatedSaveButton
                                        isSaving={loadingPassword}
                                        isSuccess={successPassword}
                                        onClick={handleChangePassword}
                                        defaultText="Actualizar Contraseña"
                                        savingText="Actualizando..."
                                        className="btn-primary full-width"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="view-profile-section">
                            <div className="profile-hero">
                                <div className="avatar-huge" style={{ overflow: 'hidden' }}>
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar.startsWith('http') ? user.avatar : `${ENVIRONMENT.URL_API.replace('/api', '')}${user.avatar}`}
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        user.nombre.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <h2>{user.nombre}</h2>
                                <p className="user-email">{user.email}</p>
                                <p className="user-joined">Ingresó: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>

                            <hr className="divider" />

                            <div className="form-group" style={{ padding: '0 24px', opacity: 0.8 }}>
                                <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>📝 Datos Personales</h3>
                                <label>Nombre Completo</label>
                                <input type="text" value={user.nombre} disabled className="input-styled disabled" />

                                <label style={{ marginTop: '12px' }}>Email</label>
                                <input type="text" value={user.email} disabled className="input-styled disabled" />

                                <label style={{ marginTop: '12px' }}>Fecha de Alta</label>
                                <input type="text" value={new Date(user.createdAt || Date.now()).toLocaleDateString()} disabled className="input-styled disabled" />
                            </div>

                            <hr className="divider" />

                            {user.rol === 'EMPLOYEE' ? (
                                <div className="profile-stats">
                                    <h3>📊 Mi Progreso de Onboarding</h3>

                                    <div className="progress-container">
                                        <div className="progress-bar-bg">
                                            <div className="progress-bar-fill" style={{ width: `${stats.progress}%` }}></div>
                                        </div>
                                        <span className="progress-text">{stats.progress}% Global</span>
                                    </div>

                                    <ul className="stats-list">
                                        <li>Cursos Asignados: <span>{stats.assigned}</span></li>
                                        <li>Cursos Completados: <span>{stats.completed}</span></li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="profile-stats admin">
                                    <h3><ShieldAlert size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Nivel de Acceso</h3>
                                    <p className="role-badge">{user.rol}</p>
                                    <p className="text-muted" style={{ marginTop: '12px', fontSize: '13px' }}>
                                        Tienes privilegios administrativos para gestionar usuarios y cursos en la plataforma.
                                    </p>
                                </div>
                            )}

                            <div className="sidebar-footer">
                                <button className="btn-logout" onClick={handleLogout}>
                                    <LogOut size={16} /> Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
