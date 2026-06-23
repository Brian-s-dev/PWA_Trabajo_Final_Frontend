import React from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import useForm from '../hooks/useForm';
import useRequest from '../hooks/useRequest';
import { resetPasswordService } from '../services/auth.service';

const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams();
    const reset_token = searchParams.get('reset_token');
    const navigate = useNavigate();

    const { formValues, handleChange } = useForm({ new_password: '' });
    const { execute, loading, error } = useRequest();
    const [successMessage, setSuccessMessage] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reset_token) return;

        try {
            const data = await execute(resetPasswordService(reset_token, formValues.new_password));
            setSuccessMessage(data.message);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            // Error manejado por useRequest
        }
    };

    if (!reset_token) {
        return <div><h1>Error</h1><p>No se proporcionó token de recuperación en la URL.</p></div>;
    }

    return (
        <div>
            <h1>Restablecer Contraseña</h1>
            {error && <p>{error}</p>}
            {successMessage && <p>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Nueva Contraseña:
                    <input 
                        type="password" 
                        name="new_password" 
                        value={formValues.new_password} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordScreen;
