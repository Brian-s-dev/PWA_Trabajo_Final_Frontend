import React from 'react';
import useForm from '../hooks/useForm';
import useRequest from '../hooks/useRequest';
import { forgotPasswordService } from '../services/auth.service';

const ForgotPasswordScreen = () => {
    const { formValues, handleChange } = useForm({ email: '' });
    const { execute, loading, error } = useRequest();
    const [successMessage, setSuccessMessage] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await execute(forgotPasswordService(formValues.email));
        setSuccessMessage(data.message);
    };

    return (
        <div>
            <h1>Recuperar Contraseña</h1>
            {error && <p>{error}</p>}
            {successMessage && <p>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordScreen;
