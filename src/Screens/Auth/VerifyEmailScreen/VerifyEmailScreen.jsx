import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { verifyEmailService } from '../../../services/auth.service';
import { MailCheck, XCircle } from 'lucide-react';
import LogoIcon from '../../../Components/LogoIcon/LogoIcon';
import '../AuthScreens.css';

const VerifyEmailScreen = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('verification_token');

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        if (!token) {
            setStatus('error');
            setMessage('Token inválido o faltante.');
            return;
        }

        const verify = async () => {
            try {
                const response = await verifyEmailService(token);
                setStatus('success');
                setMessage(response.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Error al verificar el correo.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-icon-wrapper">
                    <LogoIcon size={48} />
                </div>

                <h2 className="auth-title">Verificación de Correo</h2>

                {status === 'loading' && (
                    <div className="auth-msg-container-simple">
                        <p className="auth-subtitle">Verificando tu cuenta, por favor espera...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="auth-msg-container-simple">
                        <MailCheck size={48} className="auth-status-icon-success" />
                        <p className="auth-success-message">{message}</p>
                        <Link to="/" className="auth-submit-btn auth-success-link">Iniciar Sesión</Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="auth-msg-container-simple">
                        <XCircle size={48} className="auth-status-icon-error" />
                        <p className="auth-error-message">{message}</p>
                        <Link to="/" className="auth-submit-btn auth-success-link">Volver al Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailScreen;
