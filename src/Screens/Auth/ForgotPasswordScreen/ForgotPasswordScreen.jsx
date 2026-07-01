import React, { useState } from 'react';
import { Link } from 'react-router';
import useForm from '../../../hooks/useForm';
import useRequest from '../../../hooks/useRequest';
import { forgotPasswordService } from '../../../services/auth.service';
<<<<<<< HEAD
import { KeyRound, Layout } from 'lucide-react';
=======
import { KeyRound } from 'lucide-react';
import LogoIcon from '../../../Components/LogoIcon/LogoIcon';
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
import '../AuthScreens.css';

const ForgotPasswordScreen = () => {
    const { formValues, handleChange } = useForm({ email: '' });
    const { execute, loading, error } = useRequest();
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await execute(forgotPasswordService(formValues.email));
            setSuccessMessage(response.message);
        } catch (err) {
            console.log("Error al pedir recuperación de clave");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon-wrapper">
<<<<<<< HEAD
                    <Layout size={24} />
                </div>

=======
                    <LogoIcon size={48} />
                </div>
                
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
                <h2 className="auth-title">Recuperar Contraseña</h2>
                <p className="auth-subtitle">Ingresa tu email para recibir instrucciones</p>

                {successMessage ? (
                    <div className="auth-success-container">
                        <p className="auth-success-message">{successMessage}</p>
                        <Link to="/" className="auth-submit-btn auth-success-link">Volver al Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
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

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            <KeyRound size={16} />
                            {loading ? 'Enviando...' : 'Enviar enlace'}
                        </button>

                        {error && <div className="auth-error">{error}</div>}
                    </form>
                )}

                <div className="auth-links">
                    <Link to="/" className="auth-link">
                        Volver a iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
