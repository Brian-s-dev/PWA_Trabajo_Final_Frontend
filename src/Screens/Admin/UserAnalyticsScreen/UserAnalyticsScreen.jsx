import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { getUserAnalyticsService } from '../../../services/stats.service';
import { Users, ArrowLeft, Target, TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import './UserAnalyticsScreen.css';

const UserAnalyticsScreen = () => {
    const { userId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await getUserAnalyticsService(userId);
                setAnalytics(res.data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [userId]);

    if (loading) return <div className="screen-container page-loading">Cargando perfil...</div>;
    if (error) return <div className="screen-container">Error: {error}</div>;

    const { avgProgress, stalledCourses, recentModules, timeline } = analytics;

    return (
        <div className="screen-container">
            <div className="analytics-header">
                <Link to="/admin/users" className="back-btn">
                    <ArrowLeft size={20} /> Volver a usuarios
                </Link>
                <div className="header-titles">
                    <h1 className="analytics-title">Analíticas del Empleado</h1>
                    <p className="analytics-subtitle">ID: {userId}</p>
                </div>
            </div>

            <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                    <div className="kpi-icon"><Target size={24} /></div>
                    <div className="kpi-info">
                        <h3>Avance Promedio</h3>
                        <p className="kpi-value">{avgProgress}%</p>
                    </div>
                </div>
                <div className="admin-kpi-card">
                    <div className="kpi-icon"><TrendingUp size={24} /></div>
                    <div className="kpi-info">
                        <h3>Ritmo de Estudio</h3>
                        <p className="kpi-value">{recentModules}</p>
                        <span className="kpi-desc">Módulos completados (últimos 28 días)</span>
                    </div>
                </div>
                <div className="admin-kpi-card">
                    <div className="kpi-icon alert"><AlertTriangle size={24} color="var(--danger-color)" /></div>
                    <div className="kpi-info">
                        <h3>Cursos Estancados</h3>
                        <p className="kpi-value">{stalledCourses.length}</p>
                        <span className="kpi-desc">Pendientes hace &gt; 14 días</span>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="admin-panel-card analytics-card">
                    <h3 className="panel-card-title">Alertas de Seguimiento</h3>
                    <p className="panel-card-desc">Cursos asignados que no han sido iniciados.</p>
                    <div className="stalled-list">
                        {stalledCourses.length > 0 ? (
                            stalledCourses.map((course, idx) => (
                                <div key={idx} className="stalled-item">
                                    <AlertTriangle size={16} color="var(--danger-color)" />
                                    <div className="stalled-info">
                                        <h4>{course.titulo}</h4>
                                        <p>Asignado el {new Date(course.asignadoEl).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state-text">
                                <CheckCircle size={32} color="var(--success-color)" style={{ margin: '0 auto 12px' }} />
                                <p>Al día. No hay cursos estancados.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-panel-card analytics-card">
                    <h3 className="panel-card-title">Historial de Actividad Reciente</h3>
                    <div className="timeline-container">
                        {timeline.length > 0 ? (
                            timeline.map((event, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className="timeline-icon">
                                        {event.type === 'enrollment' ? <Clock size={14} /> : <CheckCircle size={14} />}
                                    </div>
                                    <div className="timeline-content">
                                        <span className="timeline-date">
                                            {new Date(event.date).toLocaleDateString()} a las {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <p className="timeline-text">{event.title}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state-text">Sin actividad reciente registrada.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAnalyticsScreen;
