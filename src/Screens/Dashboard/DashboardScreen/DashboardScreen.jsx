import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router';
import { getMyCoursesService } from '../../../services/enrollment.service';
import { BookOpen, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
<<<<<<< HEAD
import PlexusBackground from '../../../Components/PlexusBackground/PlexusBackground';
=======
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
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
<<<<<<< HEAD
            <PlexusBackground />
=======
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
            <div className="dashboard-header">
                <h1 className="dashboard-title">Proyectos de capacitación</h1>
                <p className="dashboard-subtitle">Bienvenido de vuelta, {user?.nombre || 'Estudiante'}. Aquí están tus módulos asignados.</p>
            </div>

            {loading ? (
                <div className="empty-state-padding">Cargando tus cursos...</div>
            ) : enrollments.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={48} className="empty-state-icon" />
                    <h3 className="empty-state-title">No tienes cursos asignados</h3>
                    <p className="empty-state-text-muted">Cuando un administrador te asigne un curso, aparecerá aquí.</p>
                </div>
            ) : (
                <div className="course-grid">
                    {enrollments.map((enrollment) => (
                        <div key={enrollment._id} className="course-card">
                            <div className="course-card-top-accent"></div>
                            <div className="course-card-content">
                                <div className="course-card-header">
                                    {renderStatusBadge(enrollment.estado)}
                                    <div className="course-icon-container-minimal">
                                        <GraduationCap size={18} />
                                    </div>
                                </div>
                                
                                <h3 className="course-title">{enrollment.curso?.titulo || 'Curso sin título'}</h3>
                                <p className="course-description">
                                    {enrollment.curso?.descripcion?.substring(0, 100) || 'Sin descripción...'}
                                    {enrollment.curso?.descripcion?.length > 100 ? '...' : ''}
                                </p>
                            </div>

                            <div className="course-card-footer">
                                <Link 
                                    to={`/course/${enrollment.curso?._id}`} 
                                    className={`course-action-link ${enrollment.estado === 'COMPLETADO' ? 'secondary' : ''}`}
                                >
                                    {enrollment.estado === 'COMPLETADO' ? 'Repasar módulo' : 'Continuar módulo'} 
                                    <ArrowRight size={16} className="icon-inline-ml4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardScreen;
