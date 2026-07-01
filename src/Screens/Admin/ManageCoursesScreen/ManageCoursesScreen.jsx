import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../context/AuthContext';
import { getAllCoursesService, deleteCourseService, updateCourseService } from '../../../services/course.service';
import { deleteModuleService } from '../../../services/module.service';
import { generateCourseFromPdfService } from '../../../services/ai.service';
import ConfirmModal from '../../../Components/ConfirmModal/ConfirmModal';
import AiCourseModal from '../../../Components/AiCourseModal/AiCourseModal';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import { Plus, Edit, Trash2, ArrowLeft, RefreshCw, ChevronDown, ChevronRight, Sparkles, BarChart2, Users } from 'lucide-react';
import '../AdminTables/AdminTables.css';
import './ManageCoursesScreen.css';

const ManageCoursesScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [expandedCourseId, setExpandedCourseId] = useState(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [isHardDelete, setIsHardDelete] = useState(false);

    const [isModuleConfirmOpen, setIsModuleConfirmOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    const fetchCourses = async () => {
        try {
            const response = await getAllCoursesService(true);
            setCourses(response.data || []);
            setFilteredCourses(response.data || []);
        } catch (error) {
            console.error(error);
            alert('Error al cargar cursos: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const lowercasedSearch = searchTerm.toLowerCase();
        const filtered = courses.filter(course => 
            course.titulo.toLowerCase().includes(lowercasedSearch) || 
            (course.descripcion && course.descripcion.toLowerCase().includes(lowercasedSearch))
        );
        setFilteredCourses(filtered);
    }, [searchTerm, courses]);

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
                <div className="admin-panel-header" style={{ alignItems: 'center' }}>
                    <div className="flex-center-gap-16" style={{ flexShrink: 0 }}>
                        <Link to="/admin" className="btn-icon" title="Volver al Panel">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="admin-panel-title">Gestión de Cursos</h1>
                    </div>

                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
                        <SearchBar 
                            placeholder="Buscar curso por título o descripción..." 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                        />
                    </div>

                    <div className="flex-center-gap-16" style={{ flexShrink: 0 }}>
                        <button className="btn-secondary" onClick={() => setIsAiModalOpen(true)}>
                            <Sparkles size={16} /> Generar con IA
                        </button>
                        <Link to="/admin/courses/new" className="btn-primary">
                            <Plus size={16} /> Crear Curso
                        </Link>
                    </div>
                </div>

                <div className="admin-table-wrapper">
                    {loading ? (
                        <div className="mc-loading">Cargando cursos...</div>
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
                                {filteredCourses.map(course => (
                                    <React.Fragment key={course._id}>
                                        <tr className={!course.activo ? "mc-row-inactive" : ""}>
                                            <td className="mc-title-cell" onClick={() => setExpandedCourseId(course._id === expandedCourseId ? null : course._id)}>
                                                <div className="mc-title-container">
                                                    {expandedCourseId === course._id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                    <span>{course.titulo}</span>
                                                    {!course.activo && <span className="badge mc-badge-inactive">Inactivo</span>}
                                                </div>
                                            </td>
                                            <td>{course.descripcion.substring(0, 50)}...</td>
                                            <td>
                                                <span className="badge blue">{course.modulos?.length || 0} módulos</span>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <Link to={`/admin/courses/${course._id}/analytics`} className="btn-icon" title="Ver Analíticas" style={{ color: 'var(--accent-color)' }}>
                                                        <BarChart2 size={18} />
                                                        <span>Ver Analíticas</span>
                                                    </Link>
                                                    <Link to={`/admin/courses/${course._id}/assign`} className="btn-icon" title="Asignar Usuarios" style={{ color: 'var(--primary-color)' }}>
                                                        <Users size={18} />
                                                        <span>Asignar</span>
                                                    </Link>
                                                    <Link to={`/admin/courses/${course._id}`} className="btn-icon edit" title="Editar">
                                                        <Edit size={18} />
                                                        <span>Editar</span>
                                                    </Link>
                                                    {course.activo !== false ? (
                                                        <button onClick={() => requestDelete(course._id, false)} className="btn-icon delete" title="Desactivar (Soft Delete)">
                                                            <Trash2 size={18} />
                                                            <span>Desactivar</span>
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => reactivateCourse(course._id)} className="btn-icon mc-btn-reactivate" title="Reactivar">
                                                            <RefreshCw size={18} />
                                                            <span>Reactivar</span>
                                                        </button>
                                                    )}
                                                    {user?.rol === 'SUPERADMIN' && (
                                                        <button onClick={() => requestDelete(course._id, true)} className="btn-icon delete mc-btn-hard-delete" title="Eliminar Definitivamente (Hard Delete)">
                                                            <Trash2 size={18} fill="currentColor" />
                                                            <span>Eliminar</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedCourseId === course._id && (
                                            <tr className="mc-modules-row">
                                                <td colSpan="4" className="mc-modules-cell">
                                                    <div className="mc-modules-header">
                                                        <h4 className="mc-modules-title">Módulos del Curso</h4>
                                                    </div>
                                                    {course.modulos && course.modulos.length > 0 ? (
                                                        <ul className="mc-modules-list">
                                                            {course.modulos.map((mod, index) => (
                                                                <li key={mod._id || index} className="mc-module-item">
                                                                    <span className="mc-module-title">{mod.titulo}</span>
                                                                    <div className="mc-module-actions">
                                                                        <button onClick={() => navigate(`/admin/courses/${course._id}`)} className="btn-icon edit" title="Editar Módulo">
                                                                            <Edit size={16} />
                                                                            <span>Editar</span>
                                                                        </button>
                                                                        <button onClick={() => requestModuleDelete(mod._id, false)} className="btn-icon delete" title="Eliminar Módulo">
                                                                            <Trash2 size={16} />
                                                                            <span>Eliminar</span>
                                                                        </button>
                                                                        {user?.rol === 'SUPERADMIN' && (
                                                                            <button onClick={() => requestModuleDelete(mod._id, true)} className="btn-icon delete mc-btn-hard-delete" title="Hard Delete Módulo">
                                                                                <Trash2 size={16} fill="currentColor" />
                                                                                <span>Hard Delete</span>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="mc-module-empty">No hay módulos en este curso.</p>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="mc-empty-state">
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
            <AiCourseModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                onGenerate={async (file) => {
                    const response = await generateCourseFromPdfService(file);
                    navigate('/admin/courses/new', { state: { courseData: response.data } });
                }} 
            />
        </div>
    );
};

export default ManageCoursesScreen;
