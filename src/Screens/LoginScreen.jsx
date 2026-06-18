import React from 'react';
import { useNavigate } from 'react-router';
import useForm from '../hooks/useForm';
import useRequest from '../hooks/useRequest';
import { loginService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
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

            navigate('/dashboard');

        } catch (err) {

            console.log("Intento de login fallido");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    type="email"
                    name="email"
                    placeholder="tu_correo@gmail.com"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    value={formValues.password}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                />

                <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
                    {loading ? 'Verificando credenciales...' : 'Entrar'}
                </button>

                {error && <div style={{ color: 'white', backgroundColor: 'red', padding: '10px', borderRadius: '5px' }}>
                    {error}
                </div>}
            </form>
        </div>
    );
};

export default LoginScreen;