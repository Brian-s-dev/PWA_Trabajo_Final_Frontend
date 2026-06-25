import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { markModuleCompletedService } from '../services/enrollment.service';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import './ModuleContentScreen.css';

const ModuleContentScreen = () => {
    const { id, moduleId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [moduleData, setModuleData] = useState(null);
    const [loadingContent, setLoadingContent] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Reutilizamos getMyCourses para traer el módulo correspondiente
                const { getMyCoursesService } = await import('../services/enrollment.service');
                const response = await getMyCoursesService();
                const enrollment = response.data.find(e => e.curso._id === id);
                if (enrollment) {
                    const mod = enrollment.curso.modulos.find(m => m._id === moduleId);
                    const progress = enrollment.moduleProgress?.find(p => p.modulo.toString() === moduleId.toString());
                    if (mod) {
                        setModuleData({
                            titulo: mod.titulo,
                            contenido: mod.contenido,
                            isCompleted: progress?.estado === 'COMPLETADO'
                        });
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
            // Si es exitoso, redirigimos de vuelta al curso
            navigate(`/course/${id}`);
        } catch (error) {
            console.error("Error al marcar como completado", error);
            alert("No se pudo marcar como completado. " + (error.message || ""));
            setLoading(false);
        }
    };

    return (
        <div className="screen-container">
                {loadingContent ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando contenido...</div>
                ) : !moduleData ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--danger-color)' }}>Módulo no encontrado.</div>
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
        </div>
    );
};

export default ModuleContentScreen;
