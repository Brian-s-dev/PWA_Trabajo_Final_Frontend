import React from 'react';
import { useNavigate, Link } from 'react-router';
import useForm from '../../../hooks/useForm';
import useRequest from '../../../hooks/useRequest';
import { loginService } from '../../../services/auth.service';
import { useAuth } from '../../../context/AuthContext';
import { LogIn } from 'lucide-react';
import LogoIcon from '../../../Components/LogoIcon/LogoIcon';
import '../AuthScreens.css';

const LoginScreen = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const { formValues, handleChange } = useForm({
        email: '',
        password: ''
    });
    const { execute, loading, error } = useRequest();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await execute(loginService(formValues.email, formValues.password));
            login(response.data.user, response.data.access_token);
            const role = response.data.user?.rol;
            if (role === 'ADMIN' || role === 'SUPERADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.log("Intento de login fallido");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon-wrapper">
                    <LogoIcon size={48} />
                </div>
                
                <h2 className="auth-title">Bienvenido de vuelta</h2>
                <p className="auth-subtitle">Ingresa a tu cuenta para continuar</p>

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
                    
                    <div className="auth-input-group">
                        <label className="auth-label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Tu contraseña"
                            value={formValues.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="auth-submit-btn">
                        <LogIn size={16} />
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>

                    {error && <div className="auth-error">{error}</div>}
                </form>
                
                <div className="auth-links">
                    <Link to="/forgot-password" className="auth-link auth-link-primary">
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <Link to="/register" className="auth-link">
                        ¿No tienes una cuenta? Crear una
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
