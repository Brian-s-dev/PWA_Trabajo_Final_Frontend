import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { assignCourseService, unassignCourseService, getEmployeeCoursesService } from '../../../services/enrollment.service';
import { getAllCoursesService } from '../../../services/course.service';
import { PlusCircle, MinusCircle, User, ArrowLeft } from 'lucide-react';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import './AssignCoursesScreen.css';
import '../AdminTables/AdminTables.css';

const AssignCoursesScreen = () => {
    const { userId } = useParams();

    const [assignedCourses, setAssignedCourses] = useState([]);
    const [unassignedCourses, setUnassignedCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    const lowercasedSearch = searchTerm.toLowerCase();
    const filteredUnassigned = unassignedCourses.filter(c => c.titulo.toLowerCase().includes(lowercasedSearch));
    const filteredAssigned = assignedCourses.filter(c => c.titulo.toLowerCase().includes(lowercasedSearch));

    return (
        <div className="screen-container">
            <div className="admin-panel-container ac-panel-container">
<<<<<<< HEAD
                <div className="admin-panel-header" style={{ alignItems: 'center' }}>
                    <div style={{ flexShrink: 0 }}>
=======
                <div className="admin-panel-header">
                    <div>
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
                        <h1 className="admin-panel-title ac-panel-title">
                            <User /> Asignación de Cursos
                        </h1>
                        <p className="ac-panel-subtitle">
                            Gestionando cursos para el usuario: <strong className="ac-user-id">ID {userId || 'Desconocido'}</strong>
                        </p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
                        <SearchBar 
                            placeholder="Buscar curso por título..." 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                        />
                    </div>

                    <Link to="/admin/users" className="btn-secondary" style={{ flexShrink: 0 }}>
                        <ArrowLeft size={16} /> Volver a Usuarios
                    </Link>
                </div>
            </div>

            <div className="assign-container">
                {loading ? (
                    <div className="ac-loading-state">Cargando datos...</div>
                ) : (
                    <>
                        <div className="assign-column">
                            <div className="assign-column-header">Cursos Disponibles</div>
                            <div className="assign-list">
<<<<<<< HEAD
                                {filteredUnassigned.length === 0 ? (
                                    <p className="ac-empty-list">No hay cursos disponibles que coincidan con tu búsqueda.</p>
=======
                                {unassignedCourses.length === 0 ? (
                                    <p className="ac-empty-list">No hay más cursos disponibles.</p>
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
                                ) : (
                                    filteredUnassigned.map(course => (
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
                            <div className="assign-column-header ac-header-assigned">
                                Cursos Asignados
                            </div>
                            <div className="assign-list">
<<<<<<< HEAD
                                {filteredAssigned.length === 0 ? (
                                    <p className="ac-empty-list">El usuario no tiene cursos asignados que coincidan con tu búsqueda.</p>
=======
                                {assignedCourses.length === 0 ? (
                                    <p className="ac-empty-list">El usuario no tiene cursos asignados.</p>
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
                                ) : (
                                    filteredAssigned.map(course => (
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
