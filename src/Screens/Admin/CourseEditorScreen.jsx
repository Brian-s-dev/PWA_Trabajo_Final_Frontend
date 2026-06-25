import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createCourseService, updateCourseService, getCourseByIdService } from '../../services/course.service';
import { createModuleService, updateModuleService, deleteModuleService } from '../../services/module.service';
import { Save, Plus, Trash2, Book, ListChecks } from 'lucide-react';
import AnimatedSaveButton from '../../Components/AnimatedSaveButton/AnimatedSaveButton';
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
                await updateCourseService(courseId, form);

                for (const modId of deletedModules) {
                    await deleteModuleService(courseId, modId, true);
                }

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
                const courseResponse = await createCourseService(form);
                const newCourseId = courseResponse.data._id;

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
        return <div className="screen-container empty-state-padding">Cargando...</div>;
    }

    return (
        <div className="screen-container">
            <div className="editor-container">
                <div className="editor-header">
                    <h1 className="editor-title">{isEditMode ? 'Editar Curso y Módulos' : 'Crear Nuevo Curso'}</h1>
                </div>

                <div className="editor-body">
                    {error && <div className="editor-error-msg">{error}</div>}

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

                        <div className="modules-header">
                            <h2 className="modules-title">
                                <ListChecks size={20} className="icon-primary" /> Módulos del Curso
                            </h2>
                            <button type="button" onClick={addModule} className="btn-secondary btn-small">
                                <Plus size={14} /> Añadir Módulo
                            </button>
                        </div>

                        {modules.map((mod, index) => (
                            <div key={index} className="editor-module-card">
                                {modules.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeModule(index)}
                                        className="module-delete-btn"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                <div className="editor-input-group mb-12 pr-32">
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
                                <div className="editor-input-group mb-12">
                                    <label className="editor-label">Descripción (Opcional)</label>
                                    <input
                                        type="text"
                                        value={mod.descripcion || ''}
                                        onChange={(e) => handleModuleChange(index, 'descripcion', e.target.value)}
                                        className="editor-input"
                                        placeholder="Breve resumen del módulo"
                                    />
                                </div>
                                <div className="editor-input-group mb-0">
                                    <label>Contenido del Módulo (Markdown)</label>
                                    <div data-color-mode="dark" className="md-editor-wrapper">
                                        <MDEditor
                                            value={mod.contenido || ''}
                                            onChange={(val) => handleModuleChange(index, 'contenido', val || '')}
                                            height={250}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="editor-footer mt-32">
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
