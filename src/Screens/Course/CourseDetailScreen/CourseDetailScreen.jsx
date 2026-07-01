import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { getMyCoursesService } from '../../../services/enrollment.service';
import { BookOpen, CheckCircle, Circle, PlayCircle, ArrowLeft } from 'lucide-react';
import './CourseDetailScreen.css';

const CourseDetailScreen = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const response = await getMyCoursesService();
                const enrollment = response.data.find(e => e.curso._id === id);
                setCourseData(enrollment);
            } catch (error) {
                console.error("Error al obtener detalle del curso", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetail();
    }, [id]);

    if (loading) {
        return <div className="screen-container empty-state-muted">Cargando detalles del curso...</div>;
    }

    if (!courseData || !courseData.curso) {
        return <div className="screen-container empty-state-danger">Curso no encontrado o no asignado.</div>;
    }

    const { curso } = courseData;

    return (
        <div className="screen-container">
            <div className="mb-16">
                <Link to="/dashboard" className="back-link">
                    <ArrowLeft size={18} /> Volver a Mis Cursos
                </Link>
            </div>
            <div className="course-detail-header">
                <h1 className="course-detail-title">{curso.titulo}</h1>
                <p className="course-detail-description">{curso.descripcion}</p>
            </div>

            <div className="module-list-section">
                <h2 className="module-list-title">Módulos del Curso</h2>

                {curso.modulos && curso.modulos.length > 0 ? (
                    curso.modulos.map((modulo, index) => {
                        const progress = courseData.moduleProgress?.find(p => p.modulo.toString() === modulo._id.toString());
                        const isCompleted = progress?.estado === 'COMPLETADO';

                        return (
                            <div key={modulo._id || index} className="module-card">
                                <div className="module-info">
                                    {isCompleted ? (
                                        <CheckCircle size={24} className="module-icon completed" />
                                    ) : (
                                        <Circle size={24} className="module-icon" />
                                    )}
                                    <div>
                                        <h3 className="module-title">{modulo.titulo || `Módulo ${index + 1}`}</h3>
                                        <p className={`module-status-text ${isCompleted ? 'completed' : ''}`}>
                                            {isCompleted ? 'Completado' : 'Pendiente'}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    to={`/course/${curso._id}/module/${modulo._id}`}
                                    className={`module-action-btn ${isCompleted ? 'secondary' : ''}`}
                                >
                                    <PlayCircle size={16} />
                                    {isCompleted ? 'Repasar' : 'Comenzar'}
                                </Link>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-modules-container">
                        <p className="text-muted">Este curso aún no tiene módulos publicados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetailScreen;
