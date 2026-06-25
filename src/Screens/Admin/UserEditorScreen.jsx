import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { createUserService } from '../../services/user.service';
import { Save, UserPlus, ArrowLeft } from 'lucide-react';
import AnimatedSaveButton from '../../Components/AnimatedSaveButton/AnimatedSaveButton';
import './UserEditorScreen.css';
import '../Auth/AuthScreens.css';

const UserEditorScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'EMPLOYEE'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createUserService(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/users');
            }, 1000);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="screen-container">
            <div className="admin-panel-container">
                <div className="admin-panel-header">
                    <div className="flex-center-gap-16">
                        <Link to="/admin/users" className="btn-icon">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="admin-panel-title">Crear Nuevo Usuario</h1>
                    </div>
                </div>

                <div className="user-editor-form">
                    <div className="auth-header text-left mb-24">
                        <div className="auth-icon start-align">
                            <UserPlus size={28} />
                        </div>
                        <h2 className="form-title">Datos del Empleado</h2>
                        <p className="form-subtitle">Ingresa la información para registrar al nuevo colaborador.</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="user-editor-grid">
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: María López"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@empresa.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña Temporal</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>Rol en el Sistema</label>
                            <select name="rol" value={formData.rol} onChange={handleChange} required>
                                <option value="EMPLOYEE">Empleado (Estudiante)</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <Link to="/admin/users" className="btn-secondary no-decoration">
                                Cancelar
                            </Link>
                            <AnimatedSaveButton 
                                type="submit"
                                isSaving={loading}
                                isSuccess={success}
                                defaultText="Confirmar"
                                savingText="Guardando..."
                                icon={Save}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserEditorScreen;
