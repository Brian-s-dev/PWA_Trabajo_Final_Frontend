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
    const [criticalFilter, setCriticalFilter] = useState('abandonment');
    const [hoveredPie, setHoveredPie] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const getProcessedCriticalCourses = () => {
        if (!stats.criticalCourses || stats.criticalCourses.length === 0) return [];
        let sorted = [...stats.criticalCourses];
        
        if (criticalFilter === 'abandonment') {
            sorted.sort((a, b) => (b.abandonmentRate || 0) - (a.abandonmentRate || 0));
        } else if (criticalFilter === 'completion') {
            sorted.sort((a, b) => (a.completionRate || 0) - (b.completionRate || 0));
        } else if (criticalFilter === 'volume') {
            sorted.sort((a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0));
        } else if (criticalFilter === 'fast') {
            sorted = sorted.filter(c => c.avgCompletionTime !== null && c.avgCompletionTime !== undefined)
                           .sort((a, b) => a.avgCompletionTime - b.avgCompletionTime);
        }
        return sorted.slice(0, 5);
    };

    const dynamicChartHeight = Math.max(300, criticalCoursesData.length * 80);
    const criticalCoursesData = getProcessedCriticalCourses();

    const renderCustomActiveShape = (props) => {
        return <Cell fill={props.payload.color} />;
    };

    const isMobileChart = windowWidth <= 400;

    const renderYAxisTick = ({ x, y, payload }) => {
        if (isMobileChart) {
            const shortText = payload.value.length > 45 ? payload.value.substring(0, 45) + '...' : payload.value;
            return (
                <text x={20} y={y - 12} fill="var(--text-primary)" fontSize={11} textAnchor="start">
                    {shortText}
                </text>
            );
        }
        return (
            <text x={x} y={y} dy={4} fill="var(--text-primary)" fontSize={12} textAnchor="end">
                {payload.value}
            </text>
        );
    };

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

            <div className="admin-top-grid">
                <div className="admin-charts-column">
                    <div className="admin-panel-card induction-card">
                        <div className="induction-header">
                            <h3 className="panel-card-title">Estado de las Inducciones</h3>
                            <span className="induction-subtitle">Mes actual</span>
                        </div>
                        <div className="donut-chart-wrapper">
                            {pieData.length > 0 ? (
                                <>
                                    <div className="donut-chart-container">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie 
                                                    data={pieData} 
                                                    cx="50%" 
                                                    cy="50%" 
                                                    innerRadius={80} 
                                                    outerRadius={90} 
                                                    paddingAngle={5} 
                                                    dataKey="value"
                                                    onMouseEnter={(_, index) => setHoveredPie(pieData[index])}
                                                    onMouseLeave={() => setHoveredPie(null)}
                                                    stroke="none"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }} itemStyle={{ color: 'var(--text-primary)' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="donut-center-content">
                                            {hoveredPie ? (
                                                <>
                                                    <span className="donut-center-value">{hoveredPie.value}</span>
                                                    <span className="donut-center-label">{hoveredPie.name}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="donut-center-value">{stats.globalCompletionRate}%</span>
                                                    <span className="donut-center-label">Tasa de Éxito</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="donut-chart-legend vertical">
                                        {pieData.map((item, idx) => (
                                            <div key={idx} className="legend-item">
                                                <div className="legend-dot-square" style={{ backgroundColor: item.color }} />
                                                <span className="legend-label">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="empty-state-text">Sin datos de inscripciones.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* barra laterladerecha */}
                <div className="admin-actions-column">
                    <div className="admin-panel-card action-card-half">
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

                    <div className="admin-panel-card double-role-card action-card-half">
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

            {/* Bottom Full Width Grid */}
            <div className="admin-bottom-grid">
                <div className="admin-panel-card full-width-card critical-courses-container">
                    <div className="critical-courses-sidebar">
                        <div className="sidebar-header">
                            <Activity size={18} color="var(--accent-color)" />
                            <h3>Métricas de Cursos</h3>
                        </div>
                        <div className="critical-tabs">
                            <button className={`critical-tab ${criticalFilter === 'abandonment' ? 'active' : ''}`} onClick={() => setCriticalFilter('abandonment')}>
                                Mayor tasa de abandono
                            </button>
                            <button className={`critical-tab ${criticalFilter === 'completion' ? 'active' : ''}`} onClick={() => setCriticalFilter('completion')}>
                                Menor finalización
                            </button>
                            <button className={`critical-tab ${criticalFilter === 'volume' ? 'active' : ''}`} onClick={() => setCriticalFilter('volume')}>
                                Mayor volumen alumnos
                            </button>
                            <button className={`critical-tab ${criticalFilter === 'fast' ? 'active' : ''}`} onClick={() => setCriticalFilter('fast')}>
                                Completados más rápido
                            </button>
                        </div>
                    </div>
                    
                    <div className="critical-courses-chart">
                        <div className="chart-header">
                            {criticalFilter === 'abandonment' && 'Tasa de abandono (%) - Cursos con inscritos en progreso sin completar'}
                            {criticalFilter === 'completion' && 'Menor tasa de finalización (%)'}
                            {criticalFilter === 'volume' && 'Cursos con mayor volumen de inscripciones'}
                            {criticalFilter === 'fast' && 'Cursos completados más rápido (Horas promedio)'}
                        </div>
                        
                        {criticalCoursesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={dynamicChartHeight}>
                                <BarChart data={criticalCoursesData} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        type="number" 
                                        tick={{ fill: 'var(--text-muted)' }} 
                                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        dataKey="titulo" 
                                        type="category" 
                                        width={isMobileChart ? 5 : 200} 
                                        tick={renderYAxisTick} 
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar 
                                        dataKey={
                                            criticalFilter === 'abandonment' ? 'abandonmentRate' :
                                            criticalFilter === 'completion' ? 'completionRate' :
                                            criticalFilter === 'volume' ? 'totalEnrollments' :
                                            'avgCompletionTime'
                                        } 
                                        fill="var(--accent-color)" 
                                        radius={[0, 4, 4, 0]} 
                                        barSize={12}
                                        name={
                                            criticalFilter === 'abandonment' ? 'Tasa Abandono (%)' :
                                            criticalFilter === 'completion' ? 'Tasa Finalización (%)' :
                                            criticalFilter === 'volume' ? 'Alumnos' :
                                            'Tiempo Promedio (ms)'
                                        }
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-state-chart">
                                <p className="empty-state-text">Sin datos suficientes para este filtro.</p>
                            </div>
                        )}
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
