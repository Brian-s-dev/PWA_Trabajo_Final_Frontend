import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getAllCoursesService, deleteCourseService, updateCourseService } from '../services/course.service';
import { deleteModuleService } from '../services/module.service';
import ConfirmModal from '../Components/ConfirmModal';
import { Plus, Edit, Trash2, ArrowLeft, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import './AdminTables.css';

const ManageCoursesScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para módulos expandidos
    const [expandedCourseId, setExpandedCourseId] = useState(null);

    // Estados para el Modal de Confirmación
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [isHardDelete, setIsHardDelete] = useState(false);
    
    // Estado para modal confirmación de Módulo
    const [isModuleConfirmOpen, setIsModuleConfirmOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getAllCoursesService(true);
                setCourses(response.data || []);
            } catch (error) {
                console.error(error);
                alert('Error al cargar cursos: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const requestDelete = (id, hard = false) => {
        setCourseToDelete(id);
        setIsHardDelete(hard);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!courseToDelete) return;
        try {
            await deleteCourseService(courseToDelete, isHardDelete);
            if (isHardDelete) {
                setCourses(courses.filter(c => c._id !== courseToDelete));
            } else {
                setCourses(courses.map(c => c._id === courseToDelete ? { ...c, activo: false } : c));
            }
        } catch (error) {
            alert('Error eliminando curso: ' + error.message);
        }
    };

    const reactivateCourse = async (id) => {
        try {
            await updateCourseService(id, { activo: true });
            setCourses(courses.map(c => c._id === id ? { ...c, activo: true } : c));
        } catch (error) {
            alert('Error reactivando curso: ' + error.message);
        }
    };

    const requestModuleDelete = (moduleId, hard = false) => {
        setModuleToDelete(moduleId);
        setIsHardDelete(hard);
        setIsModuleConfirmOpen(true);
    };

    const confirmModuleDelete = async () => {
        if (!moduleToDelete || !expandedCourseId) return;
        try {
            await deleteModuleService(expandedCourseId, moduleToDelete, isHardDelete);
            // Actualizar estado local
            setCourses(courses.map(c => {
                if (c._id === expandedCourseId) {
                    return {
                        ...c,
                        modulos: c.modulos.filter(m => m._id !== moduleToDelete)
                    };
                }
                return c;
            }));
        } catch (error) {
            alert('Error eliminando módulo: ' + error.message);
        }
    };

    return (
        <div className="screen-container">
            <div className="admin-panel-container">
                <div className="admin-panel-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link to="/admin" className="btn-icon" title="Volver al Panel">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="admin-panel-title">Gestión de Cursos</h1>
                    </div>
                    <Link to="/admin/courses/new" className="btn-primary">
                        <Plus size={16} /> Crear Curso
                    </Link>
                </div>

                <div className="admin-table-wrapper">
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando cursos...</div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Descripción</th>
                                    <th>Módulos</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <React.Fragment key={course._id}>
                                    <tr style={{ opacity: course.activo ? 1 : 0.6 }}>
                                        <td style={{ cursor: 'pointer' }} onClick={() => setExpandedCourseId(course._id === expandedCourseId ? null : course._id)}>
                                            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {expandedCourseId === course._id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                <span>{course.titulo}</span>
                                                {!course.activo && <span className="badge" style={{ backgroundColor: '#f3f4f6', color: '#6b7280', fontSize: '10px' }}>Inactivo</span>}
                                            </div>
                                        </td>
                                        <td>{course.descripcion.substring(0, 50)}...</td>
                                        <td>
                                            <span className="badge blue">{course.modulos?.length || 0} módulos</span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <Link to={`/admin/courses/${course._id}`} className="btn-icon edit" title="Editar">
                                                    <Edit size={18} />
                                                </Link>
                                                {course.activo !== false ? (
                                                    <button onClick={() => requestDelete(course._id, false)} className="btn-icon delete" title="Desactivar (Soft Delete)">
                                                        <Trash2 size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => reactivateCourse(course._id)} className="btn-icon" style={{ color: '#10b981' }} title="Reactivar">
                                                        <RefreshCw size={18} />
                                                    </button>
                                                )}
                                                {user?.rol === 'SUPERADMIN' && (
                                                    <button onClick={() => requestDelete(course._id, true)} className="btn-icon delete" style={{ color: 'var(--danger-color)' }} title="Eliminar Definitivamente (Hard Delete)">
                                                        <Trash2 size={18} fill="currentColor" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedCourseId === course._id && (
                                        <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                            <td colSpan="4" style={{ padding: '16px 32px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                    <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Módulos del Curso</h4>
                                                </div>
                                                {course.modulos && course.modulos.length > 0 ? (
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {course.modulos.map((mod, index) => (
                                                            <li key={mod._id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', backgroundColor: 'var(--bg-secondary)', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{mod.titulo}</span>
                                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                                    <button onClick={() => navigate(`/admin/courses/${course._id}`)} className="btn-icon edit" title="Editar Módulo">
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button onClick={() => requestModuleDelete(mod._id, false)} className="btn-icon delete" title="Eliminar Módulo">
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                    {user?.rol === 'SUPERADMIN' && (
                                                                        <button onClick={() => requestModuleDelete(mod._id, true)} className="btn-icon delete" style={{ color: 'var(--danger-color)' }} title="Hard Delete Módulo">
                                                                            <Trash2 size={16} fill="currentColor" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>No hay módulos en este curso.</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    </React.Fragment>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            No hay cursos creados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title={isHardDelete ? "Eliminar Curso Físicamente" : "Desactivar Curso"}
                message={isHardDelete 
                    ? "ATENCIÓN: Estás a punto de ELIMINAR FÍSICAMENTE este curso. Esta acción borrará el curso y todos sus módulos asociados de la base de datos de manera irreversible. ¿Estás seguro?" 
                    : "¿Estás seguro que deseas desactivar este curso? Dejará de estar disponible pero sus datos se conservarán."}
                confirmText={isHardDelete ? "Eliminar Definitivamente" : "Desactivar"}
            />
            <ConfirmModal 
                isOpen={isModuleConfirmOpen}
                onClose={() => setIsModuleConfirmOpen(false)}
                onConfirm={confirmModuleDelete}
                title={isHardDelete ? "Eliminar Módulo Físicamente" : "Eliminar Módulo"}
                message={isHardDelete 
                    ? "ATENCIÓN: Estás a punto de ELIMINAR FÍSICAMENTE este módulo. Esta acción es irreversible. ¿Estás seguro?" 
                    : "¿Estás seguro que deseas eliminar este módulo?"}
                confirmText={isHardDelete ? "Eliminar Definitivamente" : "Eliminar"}
            />
        </div>
    );
};

export default ManageCoursesScreen;
