import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { assignCourseService, unassignCourseService, getCourseEnrollmentsService } from '../../../services/enrollment.service';
import { getAllUsersService } from '../../../services/user.service';
import { getCourseByIdService } from '../../../services/course.service';
import { PlusCircle, MinusCircle, Users, ArrowLeft } from 'lucide-react';
import SearchBar from '../../../Components/SearchBar/SearchBar';
import '../AssignCoursesScreen/AssignCoursesScreen.css';
import '../AdminTables/AdminTables.css';

const AssignUsersToCourseScreen = () => {
    const { courseId } = useParams();

    const [courseInfo, setCourseInfo] = useState(null);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [unassignedUsers, setUnassignedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await getCourseByIdService(courseId);
                setCourseInfo(courseRes.data);

                const allUsersRes = await getAllUsersService(false);
                const allUsers = allUsersRes.data || [];

                const enrollmentsRes = await getCourseEnrollmentsService(courseId);
                const assignedEnrollments = enrollmentsRes.data || [];

                const assignedUsersList = assignedEnrollments.map(e => e.empleado).filter(Boolean);
                const assignedUserIds = assignedUsersList.map(u => u._id);

                const availableUsersList = allUsers.filter(u => !assignedUserIds.includes(u._id));

                setAssignedUsers(assignedUsersList);
                setUnassignedUsers(availableUsersList);
            } catch (error) {
                console.error("Error al cargar datos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId]);

    const handleAssign = async (user) => {
        try {
            await assignCourseService(user._id, courseId);
            setUnassignedUsers(unassignedUsers.filter(u => u._id !== user._id));
            setAssignedUsers([...assignedUsers, user]);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUnassign = async (user) => {
        try {
            await unassignCourseService(user._id, courseId);
            setAssignedUsers(assignedUsers.filter(u => u._id !== user._id));
            setUnassignedUsers([...unassignedUsers, user]);
        } catch (error) {
            alert(error.message);
        }
    };

    const lowercasedSearch = searchTerm.toLowerCase();
    const filteredUnassigned = unassignedUsers.filter(u => 
        u.nombre.toLowerCase().includes(lowercasedSearch) || 
        u.email.toLowerCase().includes(lowercasedSearch)
    );
    const filteredAssigned = assignedUsers.filter(u => 
        u.nombre.toLowerCase().includes(lowercasedSearch) || 
        u.email.toLowerCase().includes(lowercasedSearch)
    );

    return (
        <div className="screen-container">
            <div className="admin-panel-container ac-panel-container">
                <div className="admin-panel-header" style={{ alignItems: 'center' }}>
                    <div style={{ flexShrink: 0 }}>
                        <h1 className="admin-panel-title ac-panel-title">
                            <Users /> Asignación de Usuarios
                        </h1>
                        <p className="ac-panel-subtitle">
                            Gestionando usuarios para el curso: <strong className="ac-user-id">{courseInfo?.titulo || 'Cargando...'}</strong>
                        </p>
                    </div>

                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
                        <SearchBar 
                            placeholder="Buscar usuario por nombre o email..." 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                        />
                    </div>

                    <Link to="/admin/courses" className="btn-secondary" style={{ flexShrink: 0 }}>
                        <ArrowLeft size={16} /> Volver a Cursos
                    </Link>
                </div>
            </div>

            <div className="assign-container">
                {loading ? (
                    <div className="ac-loading-state">Cargando datos...</div>
                ) : (
                    <>
                        <div className="assign-column">
                            <div className="assign-column-header">Usuarios Disponibles</div>
                            <div className="assign-list">
                                {filteredUnassigned.length === 0 ? (
                                    <p className="ac-empty-list">No hay usuarios disponibles que coincidan con tu búsqueda.</p>
                                ) : (
                                    filteredUnassigned.map(user => (
                                        <div key={user._id} className="assign-item">
                                            <div className="assign-item-info">
                                                <span className="assign-item-title">{user.nombre}</span>
                                                <span className="assign-item-subtitle" style={{fontSize: '0.8rem', color: '#999', display: 'block'}}>{user.email}</span>
                                            </div>
                                            <button className="btn-assign" onClick={() => handleAssign(user)}>
                                                <PlusCircle size={14} /> Asignar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="assign-column">
                            <div className="assign-column-header ac-header-assigned">
                                Usuarios Asignados
                            </div>
                            <div className="assign-list">
                                {filteredAssigned.length === 0 ? (
                                    <p className="ac-empty-list">El curso no tiene usuarios asignados que coincidan con tu búsqueda.</p>
                                ) : (
                                    filteredAssigned.map(user => (
                                        <div key={user._id} className="assign-item">
                                            <div className="assign-item-info">
                                                <span className="assign-item-title">{user.nombre}</span>
                                                <span className="assign-item-subtitle" style={{fontSize: '0.8rem', color: '#999', display: 'block'}}>{user.email}</span>
                                            </div>
                                            <button className="btn-unassign" onClick={() => handleUnassign(user)}>
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

export default AssignUsersToCourseScreen;
