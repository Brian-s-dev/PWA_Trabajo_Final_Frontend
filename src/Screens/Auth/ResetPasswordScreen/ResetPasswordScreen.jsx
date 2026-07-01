import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import useForm from '../../../hooks/useForm';
import useRequest from '../../../hooks/useRequest';
import { resetPasswordService } from '../../../services/auth.service';
<<<<<<< HEAD
import { ShieldCheck, Layout } from 'lucide-react';
=======
import { ShieldCheck } from 'lucide-react';
import LogoIcon from '../../../Components/LogoIcon/LogoIcon';
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
import '../AuthScreens.css';

const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('reset_token');
    const navigate = useNavigate();

    const { formValues, handleChange } = useForm({ new_password: '' });
    const { execute, loading, error } = useRequest();
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await execute(resetPasswordService(token, formValues.new_password));
            setSuccessMessage(response.message);
        } catch (err) {
            console.log("Error al resetear clave");
        }
    };

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Enlace no válido</h2>
                    <p className="auth-subtitle">El enlace de recuperación es inválido o falta el token.</p>
                    <Link to="/" className="auth-link auth-link-primary">Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon-wrapper">
<<<<<<< HEAD
                    <Layout size={24} />
=======
                    <LogoIcon size={48} />
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
                </div>
                
                <h2 className="auth-title">Crear nueva contraseña</h2>
                <p className="auth-subtitle">Asegúrate de que sea segura</p>

                {successMessage ? (
                    <div className="auth-success-container">
                        <p className="auth-success-message">{successMessage}</p>
                        <button onClick={() => navigate('/')} className="auth-submit-btn">Ir al Login</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-input-group">
                            <label className="auth-label">Nueva Contraseña</label>
                            <input
                                type="password"
                                name="new_password"
                                placeholder="Ingresa tu nueva contraseña"
                                value={formValues.new_password}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            <ShieldCheck size={16} />
                            {loading ? 'Restableciendo...' : 'Guardar Contraseña'}
                        </button>

                        {error && <div className="auth-error">{error}</div>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordScreen;
