import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import useForm from '../hooks/useForm';
import useRequest from '../hooks/useRequest';
import { registerService } from '../services/auth.service';
import { UserPlus, Layout } from 'lucide-react';
import './AuthScreens.css';

const RegisterScreen = () => {
    const navigate = useNavigate();
    const { formValues, handleChange } = useForm({
        nombre: '',
        email: '',
        password: ''
    });
    const { execute, loading, error } = useRequest();
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await execute(registerService(formValues.nombre, formValues.email, formValues.password));
            setSuccessMessage(response.message);
        } catch (err) {
            console.log("Error de registro");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon-wrapper">
                    <Layout size={24} />
                </div>
                
                <h2 className="auth-title">Crear nueva cuenta</h2>
                <p className="auth-subtitle">Ingresa tus datos para registrarte</p>

                {successMessage ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--success-color)', fontWeight: 'bold', marginBottom: '20px' }}>{successMessage}</p>
                        <Link to="/" className="auth-submit-btn" style={{ textDecoration: 'none' }}>Ir al Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-label">Nombre Completo</label>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Tu nombre"
                                value={formValues.nombre}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="tu_correo@gmail.com"
                                value={formValues.email}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Crea una contraseña"
                                value={formValues.password}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            <UserPlus size={16} />
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </button>

                        {error && <div className="auth-error">{error}</div>}
                    </form>
                )}

                <div className="auth-links">
                    <Link to="/" className="auth-link">
                        ¿Ya tienes cuenta? Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;