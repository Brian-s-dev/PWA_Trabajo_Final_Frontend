import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createCourseService, updateCourseService, getCourseByIdService } from '../services/course.service';
import { createModuleService, updateModuleService, deleteModuleService } from '../services/module.service';
import { Save, Plus, Trash2, Book } from 'lucide-react';
import AnimatedSaveButton from '../Components/AnimatedSaveButton';
import MDEditor from '@uiw/react-md-editor';
import './CourseEditorScreen.css';

const CourseEditorScreen = () => {
    const { courseId } = useParams();
    const isEditMode = Boolean(courseId);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        titulo: '',
        descripcion: ''
    });

    const [modules, setModules] = useState([
        { titulo: '', descripcion: '', contenido: '' }
    ]);
    const [deletedModules, setDeletedModules] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            const fetchCourse = async () => {
                try {
                    const res = await getCourseByIdService(courseId);
                    setForm({
                        titulo: res.data.titulo || '',
                        descripcion: res.data.descripcion || ''
                    });
                    if (res.data.modulos && res.data.modulos.length > 0) {
                        setModules(res.data.modulos);
                    }
                } catch (error) {
                    console.error(error);
                    setError('Error cargando el curso');
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchCourse();
        }
    }, [courseId, isEditMode]);

    const handleCourseChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleModuleChange = (index, field, value) => {
        const newModules = [...modules];
        newModules[index][field] = value;
        setModules(newModules);
    };

    const addModule = () => {
        setModules([...modules, { titulo: '', descripcion: '', contenido: '' }]);
    };

    const removeModule = (index) => {
        const modToRemove = modules[index];
        if (modToRemove._id) {
            setDeletedModules([...deletedModules, modToRemove._id]);
        }
        const newModules = [...modules];
        newModules.splice(index, 1);
        setModules(newModules);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                // Actualizar curso
                await updateCourseService(courseId, form);

                // Borrar módulos que fueron eliminados en la UI
                for (const modId of deletedModules) {
                    await deleteModuleService(courseId, modId, true); // Hard delete para limpiarlos
                }

                // Actualizar o crear módulos restantes
                for (const mod of modules) {
                    if (mod.titulo && mod.contenido) {
                        if (mod._id) {
                            await updateModuleService(courseId, mod._id, { titulo: mod.titulo, descripcion: mod.descripcion, contenido: mod.contenido });
                        } else {
                            await createModuleService(courseId, { titulo: mod.titulo, descripcion: mod.descripcion, contenido: mod.contenido });
                        }
                    }
                }
            } else {
                // 1. Crear el curso base
                const courseResponse = await createCourseService(form);
                const newCourseId = courseResponse.data._id;

                // 2. Crear todos los módulos asociados a ese curso
                if (modules.length > 0) {
                    for (const mod of modules) {
                        if (mod.titulo && mod.contenido) {
                            await createModuleService(newCourseId, { titulo: mod.titulo, descripcion: mod.descripcion, contenido: mod.contenido });
                        }
                    }
                }
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/courses');
            }, 1000);
        } catch (error) {
            console.error(error);
            setError(error.message);
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="screen-container" style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
    }

    return (
        <div className="screen-container">
            <div className="editor-container">
                <div className="editor-header">
                    <h1 className="editor-title">{isEditMode ? 'Editar Curso y Módulos' : 'Crear Nuevo Curso'}</h1>
                </div>

                <div className="editor-body">
                    {error && <div style={{ color: 'var(--danger-color)', marginBottom: '16px', fontWeight: 'bold' }}>{error}</div>}
                    
                    <form id="course-form" onSubmit={handleSubmit} className="editor-form">
                        <div className="editor-input-group">
                            <label className="editor-label">Título del Curso</label>
                            <input
                                type="text"
                                name="titulo"
                                value={form.titulo}
                                onChange={handleCourseChange}
                                required
                                className="editor-input"
                                placeholder="Ej: Introducción a la Seguridad"
                            />
                        </div>

                        <div className="editor-input-group">
                            <label className="editor-label">Descripción Detallada</label>
                            <textarea
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleCourseChange}
                                required
                                className="editor-textarea"
                                placeholder="Explica de qué trata el curso..."
                            />
                        </div>

                        <div style={{ marginTop: '32px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Book size={18} /> Módulos del Curso
                            </h2>
                            <button type="button" onClick={addModule} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                <Plus size={14} /> Añadir Módulo
                            </button>
                        </div>

                        {modules.map((mod, index) => (
                            <div key={index} style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                                
                                {modules.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeModule(index)}
                                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', zIndex: 10 }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                <div className="editor-input-group" style={{ marginBottom: '12px', paddingRight: '32px' }}>
                                    <label className="editor-label">Título del Módulo {index + 1}</label>
                                    <input
                                        type="text"
                                        value={mod.titulo}
                                        onChange={(e) => handleModuleChange(index, 'titulo', e.target.value)}
                                        required
                                        className="editor-input"
                                        placeholder="Ej: Conceptos Básicos"
                                    />
                                </div>
                                <div className="editor-input-group" style={{ marginBottom: '12px' }}>
                                    <label className="editor-label">Descripción (Opcional)</label>
                                    <input
                                        type="text"
                                        value={mod.descripcion || ''}
                                        onChange={(e) => handleModuleChange(index, 'descripcion', e.target.value)}
                                        className="editor-input"
                                        placeholder="Breve resumen del módulo"
                                    />
                                </div>
                                <div className="editor-input-group" style={{ marginBottom: '0' }}>
                                    <label className="editor-label">Contenido / URL del Material</label>
                                    <div data-color-mode="dark" style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
                                        <MDEditor
                                            value={mod.contenido || ''}
                                            onChange={(val) => handleModuleChange(index, 'contenido', val || '')}
                                            height={250}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="editor-footer" style={{ marginTop: '32px' }}>
                            <button type="button" onClick={() => navigate('/admin/courses')} className="btn-secondary">
                                Cancelar
                            </button>
                            <AnimatedSaveButton 
                                type="submit"
                                isSaving={loading}
                                isSuccess={success}
                                defaultText="Confirmar"
                                savingText="Guardando..."
                                icon={Save}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseEditorScreen;
