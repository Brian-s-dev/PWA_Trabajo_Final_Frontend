import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useParams, Link, useNavigate, useLocation } from 'react-router';
import { markModuleCompletedService } from '../../../services/enrollment.service';
import { ArrowLeft, ArrowRight, CheckCircle, Circle, Menu, X } from 'lucide-react';
=======
import { useParams, Link, useNavigate } from 'react-router';
import { markModuleCompletedService } from '../../../services/enrollment.service';
import { ArrowLeft, CheckCircle } from 'lucide-react';
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
import './ModuleContentScreen.css';

const ModuleContentScreen = () => {
    const { id, moduleId } = useParams();
    const navigate = useNavigate();
<<<<<<< HEAD
    const location = useLocation();
    
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState(null);
    const [moduleData, setModuleData] = useState(null);
    const [loadingContent, setLoadingContent] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [nextModuleId, setNextModuleId] = useState(null);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoadingContent(true);
=======
    const [loading, setLoading] = useState(false);
    const [moduleData, setModuleData] = useState(null);
    const [loadingContent, setLoadingContent] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
            try {
                const { getMyCoursesService } = await import("../../../services/enrollment.service");
                const response = await getMyCoursesService();
                const enrollment = response.data.find(e => e.curso._id === id);
<<<<<<< HEAD
                
                if (enrollment) {
                    setCourseData(enrollment);
                    
                    const modIndex = enrollment.curso.modulos.findIndex(m => m._id === moduleId);
                    const mod = enrollment.curso.modulos[modIndex];
                    const progress = enrollment.moduleProgress?.find(p => p.modulo.toString() === moduleId.toString());
                    
=======
                if (enrollment) {
                    const mod = enrollment.curso.modulos.find(m => m._id === moduleId);
                    const progress = enrollment.moduleProgress?.find(p => p.modulo.toString() === moduleId.toString());
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
                    if (mod) {
                        setModuleData({
                            titulo: mod.titulo,
                            contenido: mod.contenido,
                            isCompleted: progress?.estado === 'COMPLETADO'
                        });
<<<<<<< HEAD

                        if (modIndex >= 0 && modIndex < enrollment.curso.modulos.length - 1) {
                            setNextModuleId(enrollment.curso.modulos[modIndex + 1]._id);
                        } else {
                            setNextModuleId(null);
                        }
                    } else {
                        setModuleData(null);
=======
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
                    }
                }
            } catch (error) {
                console.error("Error cargando módulo", error);
            } finally {
                setLoadingContent(false);
            }
        };
        fetchContent();
    }, [id, moduleId]);

    const handleMarkAsCompleted = async () => {
        setLoading(true);
        try {
            await markModuleCompletedService(id, moduleId);
<<<<<<< HEAD
            setModuleData(prev => ({ ...prev, isCompleted: true }));
            
            setCourseData(prev => {
                if (!prev) return prev;
                const newProgress = [...(prev.moduleProgress || [])];
                const existingProgIndex = newProgress.findIndex(p => p.modulo.toString() === moduleId.toString());
                if (existingProgIndex >= 0) {
                    newProgress[existingProgIndex] = { ...newProgress[existingProgIndex], estado: 'COMPLETADO' };
                } else {
                    newProgress.push({ modulo: moduleId, estado: 'COMPLETADO' });
                }
                return { ...prev, moduleProgress: newProgress };
            });

        } catch (error) {
            console.error("Error al marcar como completado", error);
            alert("No se pudo marcar como completado. " + (error.message || ""));
        } finally {
=======
            navigate(`/course/${id}`);
        } catch (error) {
            console.error("Error al marcar como completado", error);
            alert("No se pudo marcar como completado. " + (error.message || ""));
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
            setLoading(false);
        }
    };

<<<<<<< HEAD
    if (loadingContent) {
        return <div className="screen-container empty-state-muted padding-40">Cargando contenido...</div>;
    }

    if (!courseData || !moduleData) {
        return <div className="screen-container empty-state-danger padding-40">Curso o Módulo no encontrado.</div>;
    }

    const { curso } = courseData;

    return (
        <div className="module-viewer-layout">
            
            {isSidebarOpen && (
                <div className="module-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <aside className={`module-viewer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-course-title">{curso.titulo}</h2>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="sidebar-module-list">
                    {curso.modulos && curso.modulos.map((modulo, index) => {
                        const isCompleted = courseData.moduleProgress?.some(p => p.modulo.toString() === modulo._id.toString() && p.estado === 'COMPLETADO');
                        const isActive = modulo._id === moduleId;

                        return (
                            <Link 
                                key={modulo._id}
                                to={`/course/${id}/module/${modulo._id}`} 
                                className={`sidebar-module-item ${isActive ? 'active' : ''}`}
                            >
                                <div className="sidebar-module-icon">
                                    {isCompleted ? (
                                        <CheckCircle size={18} className="icon-completed" />
                                    ) : (
                                        <Circle size={18} className="icon-pending" />
                                    )}
                                </div>
                                <div className="sidebar-module-text">
                                    <span className="sidebar-module-number">Módulo {index + 1}</span>
                                    <span className="sidebar-module-title">{modulo.titulo}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </aside>

            <main className="module-viewer-main">
                <header className="module-main-header">
                    <button className="open-sidebar-btn" onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <div className="module-main-breadcrumbs">
                        <Link to={`/course/${id}`} className="breadcrumb-back-link">
                            <ArrowLeft size={16} /> Volver al Resumen del Curso
                        </Link>
                    </div>
                </header>
                
                <div className="module-scrollable-content">
                    <div className="module-content-inner">
                        <h1 className="module-content-title-main">{moduleData.titulo}</h1>
                        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: moduleData.contenido }} />
                        
                        <div className="module-footer-actions">
                            <div className="footer-action-left">
                                {moduleData.isCompleted ? (
                                    <div className="module-status-completed">
                                        <CheckCircle size={20} /> Módulo Completado
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleMarkAsCompleted}
                                        disabled={loading}
                                        className="btn-mark-complete"
                                    >
                                        <CheckCircle size={18} />
                                        {loading ? 'Guardando...' : 'Marcar como Completado'}
                                    </button>
                                )}
                            </div>
                            
                            <div className="footer-action-right">
                                {nextModuleId && (
                                    <Link to={`/course/${id}/module/${nextModuleId}`} className="btn-next-module">
                                        Siguiente elemento <ArrowRight size={18} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
=======
    return (
        <div className="screen-container">
            {loadingContent ? (
                <div className="empty-state-muted padding-40">Cargando contenido...</div>
            ) : !moduleData ? (
                <div className="empty-state-danger padding-40">Módulo no encontrado.</div>
            ) : (
                <div className="module-content-container">
                    <div className="module-content-header">
                        <h1 className="module-content-title">{moduleData.titulo}</h1>
                    </div>

                    <div className="module-content-body">
                        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: moduleData.contenido }} />
                    </div>

                    <div className="module-content-footer">
                        <Link to={`/course/${id}`} className="nav-button back">
                            <ArrowLeft size={18} /> Volver al Curso
                        </Link>

                        {moduleData.isCompleted ? (
                            <div className="nav-button success">
                                <CheckCircle size={18} /> Módulo Completado
                            </div>
                        ) : (
                            <button
                                onClick={handleMarkAsCompleted}
                                disabled={loading}
                                className="nav-button complete"
                            >
                                <CheckCircle size={18} />
                                {loading ? 'Guardando...' : 'Marcar como Completado'}
                            </button>
                        )}
                    </div>
                </div>
            )}
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
        </div>
    );
};

export default ModuleContentScreen;
