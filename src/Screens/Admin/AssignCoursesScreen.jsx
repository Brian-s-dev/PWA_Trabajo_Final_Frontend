import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { assignCourseService, unassignCourseService, getEmployeeCoursesService } from '../../services/enrollment.service';
import { getAllCoursesService } from '../../services/course.service';
import { PlusCircle, MinusCircle, User, ArrowLeft } from 'lucide-react';
import './AssignCoursesScreen.css';
import './AdminTables.css';

const AssignCoursesScreen = () => {
    const { userId } = useParams();

    const [assignedCourses, setAssignedCourses] = useState([]);
    const [unassignedCourses, setUnassignedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allCoursesRes = await getAllCoursesService();
                const allCourses = allCoursesRes.data || [];

                const enrollmentsRes = await getEmployeeCoursesService(userId);
                const assignedEnrollments = enrollmentsRes.data || [];

                const assignedCoursesList = assignedEnrollments.map(e => e.curso).filter(Boolean);
                const assignedCourseIds = assignedCoursesList.map(c => c._id);

                const availableCoursesList = allCourses.filter(c => !assignedCourseIds.includes(c._id));

                setAssignedCourses(assignedCoursesList);
                setUnassignedCourses(availableCoursesList);
            } catch (error) {
                console.error("Error al cargar datos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleAssign = async (course) => {
        try {
            await assignCourseService(userId, course._id);
            setUnassignedCourses(unassignedCourses.filter(c => c._id !== course._id));
            setAssignedCourses([...assignedCourses, course]);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUnassign = async (course) => {
        try {
            await unassignCourseService(userId, course._id);
            setAssignedCourses(assignedCourses.filter(c => c._id !== course._id));
            setUnassignedCourses([...unassignedCourses, course]);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="screen-container">
            <div className="admin-panel-container" style={{ marginBottom: '24px' }}>
                <div className="admin-panel-header">
                    <div>
                        <h1 className="admin-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User /> Asignación de Cursos
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                            Gestionando cursos para el usuario: <strong style={{ color: 'var(--text-primary)' }}>ID {userId || 'Desconocido'}</strong>
                        </p>
                    </div>
                    <Link to="/admin/users" className="btn-secondary">
                        <ArrowLeft size={16} /> Volver a Usuarios
                    </Link>
                </div>
            </div>

            <div className="assign-container">
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando datos...</div>
                ) : (
                    <>
                        {/* Columna Cursos Disponibles */}
                        <div className="assign-column">
                            <div className="assign-column-header">Cursos Disponibles</div>
                            <div className="assign-list">
                                {unassignedCourses.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>No hay más cursos disponibles.</p>
                                ) : (
                                    unassignedCourses.map(course => (
                                        <div key={course._id} className="assign-item">
                                            <span className="assign-item-title">{course.titulo}</span>
                                            <button className="btn-assign" onClick={() => handleAssign(course)}>
                                                <PlusCircle size={14} /> Asignar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="assign-column">
                            <div className="assign-column-header" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-hover)' }}>
                                Cursos Asignados
                            </div>
                            <div className="assign-list">
                                {assignedCourses.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>El usuario no tiene cursos asignados.</p>
                                ) : (
                                    assignedCourses.map(course => (
                                        <div key={course._id} className="assign-item">
                                            <span className="assign-item-title">{course.titulo}</span>
                                            <button className="btn-unassign" onClick={() => handleUnassign(course)}>
                                                <MinusCircle size={14} /> Remover
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AssignCoursesScreen;
