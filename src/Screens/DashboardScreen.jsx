import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router';
import { getMyCoursesService } from '../services/enrollment.service';
import { BookOpen, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import './DashboardScreen.css';

const DashboardScreen = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getMyCoursesService();
                setEnrollments(response.data || []);
            } catch (error) {
                console.error("Error fetching courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const renderStatusBadge = (status) => {
        let label = status;
        if (status === 'EN_PROGRESO') label = 'En Progreso';
        return <span className={`status-badge ${status}`}>{label}</span>;
    };

    return (
        <div className="screen-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Hola, {user?.nombre || 'Estudiante'} 👋</h1>
                <p className="dashboard-subtitle">Aquí tienes el resumen de tus capacitaciones asignadas.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Cargando tus cursos...</div>
            ) : enrollments.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={48} className="empty-state-icon" />
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>No tienes cursos asignados</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Cuando un administrador te asigne un curso, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="course-grid">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment._id} className="course-card">
                            <div className="course-card-header">
                                <div className="course-icon-container">
                                    <GraduationCap size={24} />
                                </div>
                                {renderStatusBadge(enrollment.estado)}
                            </div>
                            
                            <h3 className="course-title">{enrollment.curso?.titulo || 'Curso sin título'}</h3>
                            <p className="course-description">
                                {enrollment.curso?.descripcion?.substring(0, 100) || 'Sin descripción...'}
                                {enrollment.curso?.descripcion?.length > 100 ? '...' : ''}
                            </p>

                            <Link 
                                to={`/course/${enrollment.curso?._id}`} 
                                className={`course-action-btn ${enrollment.estado === 'COMPLETADO' ? 'secondary' : ''}`}
                            >
                                {enrollment.estado === 'COMPLETADO' ? (
                                    <>Repasar Curso <CheckCircle2 size={16} style={{ display: 'inline', marginLeft: '4px' }} /></>
                                ) : (
                                    <>Continuar Curso <ArrowRight size={16} style={{ display: 'inline', marginLeft: '4px' }} /></>
                                )}
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardScreen;