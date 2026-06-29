import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAdminStatsService } from '../../../services/stats.service';
import { getMyCoursesService } from '../../../services/enrollment.service';
import ENVIRONMENT from '../../../config/environment';
import { Users, BookOpen, Activity, PlayCircle, CheckCircle, PlusCircle, UserPlus, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './AdminDashboardScreen.css';

const AdminDashboardScreen = () => {
    const [stats, setStats] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, coursesRes] = await Promise.all([
                    getAdminStatsService(),
                    getMyCoursesService()
                ]);
                setStats(statsRes.data);
                setMyCourses(coursesRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <div className="screen-container admin-loading-state">Cargando panel de control...</div>;
    if (!stats) return <div className="screen-container">Error al cargar estadísticas.</div>;

    const pieData = [
        { name: 'Pendiente', value: stats.distribution?.PENDIENTE || 0, color: '#8884d8' },
        { name: 'En Progreso', value: stats.distribution?.EN_PROGRESO || 0, color: '#FFBB28' },
        { name: 'Completado', value: stats.distribution?.COMPLETADO || 0, color: '#00C49F' }
    ].filter(item => item.value > 0);

    return (
        <div className="screen-container">
            {/* Header */}
            <div className="admin-dashboard-header">
                <div>
                    <h1 className="admin-title">Panel de Control Global</h1>
                    <p className="admin-subtitle">Métricas y recursos humanos.</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                    <div className="kpi-icon"><Users size={24} /></div>
                    <div className="kpi-info">
                        <h3>Empleados Activos</h3>
                        <p className="kpi-value">{stats.activeEmployees}</p>
                    </div>
                </div>
                <div className="admin-kpi-card">
                    <div className="kpi-icon"><Activity size={24} /></div>
                    <div className="kpi-info">
                        <h3>Progreso Global</h3>
                        <p className="kpi-value">{stats.globalCompletionRate}%</p>
                    </div>
                </div>
                <div className="admin-kpi-card">
                    <div className="kpi-icon"><BookOpen size={24} /></div>
                    <div className="kpi-info">
                        <h3>En Progreso</h3>
                        <p className="kpi-value">{stats.inProgress}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="admin-main-grid">
                {/* Columna Izquierda: Gráficos */}
                <div className="admin-charts-column">
                    <div className="admin-panel-card">
                        <h3 className="panel-card-title">Estado de las Inducciones</h3>
                        <div className="donut-chart-wrapper">
                            {pieData.length > 0 ? (
                                <>
                                    <div className="donut-chart-container">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="donut-chart-legend">
                                        {pieData.map((item, idx) => (
                                            <div key={idx} className="legend-item">
                                                <span className="legend-dot" style={{ backgroundColor: item.color }} />
                                                <span className="legend-label">{item.name} ({item.value})</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="empty-state-text">Sin datos de inscripciones.</p>
                            )}
                        </div>
                    </div>

                    <div className="admin-panel-card">
                        <h3 className="panel-card-title">Cursos Críticos (Tasa de Finalización)</h3>
                        <div className="flex-container-center gap-20">
                            {stats.criticalCourses?.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={stats.criticalCourses} layout="vertical" margin={{ left: 50 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                                        <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: 'var(--text-muted)' }} />
                                        <YAxis dataKey="titulo" type="category" width={100} tick={{ fill: 'var(--text-primary)', fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="completionRate" fill="var(--accent-color)" radius={[0, 4, 4, 0]} name="Finalización (%)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="empty-state-text">Sin cursos registrados.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Acciones y Doble Rol */}
                <div className="admin-actions-column">
                    <div className="admin-panel-card">
                        <h3 className="panel-card-title">Acciones Rápidas</h3>
                        <div className="quick-actions-list">
                            <Link to="/admin/courses" className="quick-action-btn">
                                <PlusCircle size={18} /> Administrar cursos
                            </Link>
                            <Link to="/admin/users" className="quick-action-btn">
                                <UserPlus size={18} /> Administrar Usuarios
                            </Link>
                            <button className="quick-action-btn secondary" onClick={() => alert('Próximamente')}>
                                <FileText size={18} /> Descargar Reporte CSV
                            </button>
                        </div>
                    </div>

                    <div className="admin-panel-card double-role-card">
                        <h3 className="panel-card-title">🎒 Mis Capacitaciones</h3>
                        <p className="panel-card-desc">Cursos asignados a ti como alumno.</p>
                        <div className="my-courses-list">
                            {myCourses.length === 0 ? (
                                <p className="empty-text">No tienes cursos pendientes.</p>
                            ) : (
                                myCourses.map(enr => (
                                    <Link key={enr._id} to={`/course/${enr.curso._id}`} className="mini-course-item">
                                        <span className="mini-course-title">{enr.curso.titulo}</span>
                                        {enr.estado === 'COMPLETADO' ? <CheckCircle size={14} color="var(--success-color)" /> : <PlayCircle size={14} color="var(--accent-color)" />}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actividad Reciente */}
            <div className="admin-recent-activity">
                <h3 className="panel-card-title">🔔 Últimos Empleados Registrados</h3>
                <div className="recent-list">
                    {stats.recentEmployees?.map(emp => (
                        <div key={emp._id} className="recent-item">
                            <div className="recent-item-avatar">
                                {emp.avatar ? <img src={emp.avatar.startsWith('http') ? emp.avatar : `${ENVIRONMENT.URL_API.replace('/api', '')}${emp.avatar}`} alt="Avatar" /> : emp.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="recent-item-info">
                                <h4>{emp.nombre}</h4>
                                <p>{emp.email}</p>
                            </div>
                            <div className="recent-item-status">
                                {emp.email_verificado ? (
                                    <span className="badge verified">Email Verificado</span>
                                ) : (
                                    <span className="badge pending">Esperando Verificación</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardScreen;
