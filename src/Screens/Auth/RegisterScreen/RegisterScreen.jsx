import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import useForm from '../../../hooks/useForm';
import useRequest from '../../../hooks/useRequest';
import { registerService } from '../../../services/auth.service';
import { UserPlus } from 'lucide-react';
import LogoIcon from '../../../Components/LogoIcon/LogoIcon';
import '../AuthScreens.css';

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
                    <LogoIcon size={48} />
                </div>
                
                <h2 className="auth-title">Crear nueva cuenta</h2>
                <p className="auth-subtitle">Ingresa tus datos para registrarte</p>

                {successMessage ? (
                    <div className="auth-success-container">
                        <p className="auth-success-message">{successMessage}</p>
                        <Link to="/" className="auth-submit-btn auth-success-link">Ir al Login</Link>
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
