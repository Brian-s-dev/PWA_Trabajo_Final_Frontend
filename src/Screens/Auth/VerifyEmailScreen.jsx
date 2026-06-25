import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import { verifyEmailService } from '../../services/auth.service';
import { MailCheck, XCircle, Layout } from 'lucide-react';
import './AuthScreens.css';

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
                    <Layout size={24} />
                </div>

                <h2 className="auth-title">Verificación de Correo</h2>

                {status === 'loading' && (
                    <div style={{ padding: '20px' }}>
                        <p className="auth-subtitle">Verificando tu cuenta, por favor espera...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div style={{ padding: '20px' }}>
                        <MailCheck size={48} style={{ color: 'var(--success-color)', margin: '0 auto 16px auto' }} />
                        <p style={{ color: 'var(--success-color)', fontWeight: 'bold', marginBottom: '20px' }}>{message}</p>
                        <Link to="/" className="auth-submit-btn" style={{ textDecoration: 'none' }}>Iniciar Sesión</Link>
                    </div>
                )}

                {status === 'error' && (
                    <div style={{ padding: '20px' }}>
                        <XCircle size={48} style={{ color: 'var(--danger-color)', margin: '0 auto 16px auto' }} />
                        <p style={{ color: 'var(--danger-color)', fontWeight: 'bold', marginBottom: '20px' }}>{message}</p>
                        <Link to="/" className="auth-submit-btn" style={{ textDecoration: 'none' }}>Volver al Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailScreen;
