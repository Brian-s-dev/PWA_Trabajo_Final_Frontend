import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ENVIRONMENT from '../../config/environment';
import { getMyCoursesService } from '../../services/enrollment.service';
import { getAllCoursesService } from '../../services/course.service';
import { getAllUsersService } from '../../services/user.service';
import { ENROLLMENT_STATUS } from '../../constants/enrollmentStatus';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import { Layout, LogOut, Sun, Moon, GraduationCap, ShieldAlert, User as UserIcon, Menu, X, PlayCircle, CheckCircle } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);
    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    const [activeCourse, setActiveCourse] = useState(null);
    const [employeeState, setEmployeeState] = useState('ESPERANDO');
    const [adminStats, setAdminStats] = useState({ users: 0, courses: 0 });

    const getProgressPercentage = (enrollment) => {
        if (!enrollment) return 0;
        const completed = enrollment.moduleProgress?.filter(m => m.estado === 'COMPLETADO').length || 0;
        const total = enrollment.curso?.modulos?.length || 1;
        return Math.round((completed / total) * 100);
    };

    useEffect(() => {
        if (!user) return;

        const loadWidgetData = async () => {
            try {
                if (user.rol === 'EMPLOYEE') {
                    const res = await getMyCoursesService();
                    const enrollments = res.data || [];

                    if (enrollments.length === 0) {
                        setEmployeeState('ESPERANDO');
                        return;
                    }

                    const inProgress = enrollments.find(e => e.estado === ENROLLMENT_STATUS.EN_PROGRESO);
                    if (inProgress) {
                        setEmployeeState('PROGRESO');
                        setActiveCourse(inProgress);
                        return;
                    }

                    const pendientes = enrollments.filter(e => e.estado === ENROLLMENT_STATUS.PENDIENTE);
                    if (pendientes.length > 0) {
                        setEmployeeState('NUEVO');
                        return;
                    }

                    setEmployeeState('COMPLETADOS');
                } else {
                    const [usersRes, coursesRes] = await Promise.all([
                        getAllUsersService(),
                        getAllCoursesService()
                    ]);
                    setAdminStats({
                        users: usersRes.data?.length || 0,
                        courses: coursesRes.data?.length || 0
                    });
                }
            } catch (error) {
                console.error("Error loading widget data", error);
            }
        };

        loadWidgetData();
    }, [user, location.pathname]);

    if (!user) return null;

    return (
        <header className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => {
                    if (user.rol === 'ADMIN' || user.rol === 'SUPERADMIN') {
                        navigate('/admin');
                    } else {
                        navigate('/dashboard');
                    }
                    closeMenu();
                }}>
                    <div className="navbar-logo-icon">
                        <Layout size={20} />
                    </div>
                    <div>
                        <h1 className="navbar-title">Portal Capacitación</h1>
                        <p className="navbar-subtitle">Área del Colaborador</p>
                    </div>
                </div>

                <button className="navbar-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav className={`navbar-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
                    {(user.rol === 'ADMIN' || user.rol === 'SUPERADMIN') && (
                        <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`} onClick={closeMenu}>
                            <ShieldAlert size={16} /> Administración
                        </Link>
                    )}

                    <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={closeMenu}>
                        <GraduationCap size={16} /> Mis Cursos
                    </Link>

                    <div className="mobile-only-actions">
                        <div className="navbar-user-info-mobile" onClick={() => { setIsSidebarOpen(true); closeMenu(); }}>
                            {user.avatar ? (
                                <img
                                    src={`${ENVIRONMENT.URL_API.replace('/api', '')}${user.avatar}`}
                                    alt="Avatar"
                                    className="navbar-avatar-image large"
                                />
                            ) : (
                                <div className="navbar-avatar large">
                                    {user.nombre.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="navbar-user-name">{user.nombre}</p>
                                <p className="navbar-user-role">{user.rol}</p>
                            </div>
                        </div>

                        <button onClick={() => { toggleTheme(); closeMenu(); }} className="nav-link mobile-theme-btn">
                            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                            {theme === 'light' ? ' Tema Oscuro' : ' Tema Claro'}
                        </button>
                        <button onClick={handleLogout} className="nav-link mobile-logout-btn">
                            <LogOut size={16} /> Cerrar Sesión
                        </button>
                    </div>
                </nav>

                <div className="navbar-user-section">

                    <div className="navbar-widget desktop-only">
                        {user.rol === 'EMPLOYEE' ? (
                            <div className="widget-employee">
                                {employeeState === 'ESPERANDO' && <span className="widget-text">Esperando por cursos</span>}
                                {employeeState === 'NUEVO' && <span className="widget-text">Comienza con un curso nuevo</span>}
                                {employeeState === 'COMPLETADOS' && <span className="widget-text success"><CheckCircle size={14} /> Completaste todos los cursos!</span>}
                                {employeeState === 'PROGRESO' && activeCourse && (
                                    <Link to={`/course/${activeCourse.curso._id}`} className="widget-progress">
                                        <div className="widget-progress-header">
                                            <span className="widget-progress-title">
                                                Continuar: {activeCourse.curso.titulo}
                                            </span>
                                            <span className="widget-progress-percentage">
                                                {getProgressPercentage(activeCourse)}%
                                            </span>
                                        </div>
                                        <div className="widget-progress-bar-bg">
                                            <div className="widget-progress-bar-fill" style={{ width: `${getProgressPercentage(activeCourse)}%` }}></div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="widget-admin">
                                <span className="widget-text">Usuarios: {adminStats.users} / Cursos activos: {adminStats.courses}</span>
                            </div>
                        )}
                    </div>

                    <button onClick={toggleTheme} className="navbar-btn-icon" title="Cambiar Tema">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    <div className="navbar-user-info clickable" onClick={() => setIsSidebarOpen(true)}>
                        {user.avatar ? (
                            <img
                                src={`${ENVIRONMENT.URL_API.replace('/api', '')}${user.avatar}`}
                                alt="Avatar"
                                className="navbar-avatar-image large"
                            />
                        ) : (
                            <div className="navbar-avatar large">
                                {user.nombre.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="navbar-user-name">{user.nombre}</p>
                            <p className="navbar-user-role">{user.rol}</p>
                        </div>
                    </div>
                </div>
            </div>

            <ProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </header>
    );
};

export default Navbar;
