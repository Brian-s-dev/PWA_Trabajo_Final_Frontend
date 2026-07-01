import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { getCourseAnalyticsService } from '../../../services/stats.service';
import { getCourseByIdService } from '../../../services/course.service';
import { ArrowLeft, Activity, Users, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import './CourseAnalyticsScreen.css';

const CourseAnalyticsScreen = () => {
    const { courseId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [statsRes, courseRes] = await Promise.all([
                    getCourseAnalyticsService(courseId),
                    getCourseByIdService(courseId)
                ]);
                setAnalytics(statsRes.data);
                setCourse(courseRes.data);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [courseId]);

    if (loading) return <div className="screen-container page-loading">Cargando analíticas...</div>;
    if (error) return <div className="screen-container">Error: {error}</div>;

    const { distribution, inactiveStudents, dropoffStats, engagement } = analytics;

    const pieData = [
        { name: 'Pendiente', value: distribution.PENDIENTE || 0, color: '#8884d8' },
        { name: 'En Progreso', value: distribution.EN_PROGRESO || 0, color: '#FFBB28' },
        { name: 'Completado', value: distribution.COMPLETADO || 0, color: '#00C49F' }
    ].filter(item => item.value > 0);

    const totalStudents = pieData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="screen-container">
            <div className="analytics-header">
                <Link to="/admin/courses" className="back-btn">
                    <ArrowLeft size={20} /> Volver a cursos
                </Link>
                <div className="header-titles">
                    <h1 className="analytics-title">Analíticas del Curso</h1>
                    <p className="analytics-subtitle">{course?.titulo}</p>
                </div>
            </div>

            <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                    <div className="kpi-icon"><Users size={24} /></div>
                    <div className="kpi-info">
                        <h3>Total Inscriptos</h3>
                        <p className="kpi-value">{totalStudents}</p>
                    </div>
                </div>
                <div className="admin-kpi-card">
                    <div className="kpi-icon alert"><AlertTriangle size={24} color="var(--danger-color)" /></div>
                    <div className="kpi-info">
                        <h3>Alumnos Inactivos</h3>
                        <p className="kpi-value">{inactiveStudents}</p>
                        <span className="kpi-desc">Más de 14 días sin avanzar</span>
                    </div>
                </div>
                <div className="admin-kpi-card">
                    <div className="kpi-icon"><Activity size={24} /></div>
                    <div className="kpi-info">
                        <h3>Tasa de Éxito</h3>
                        <p className="kpi-value">
                            {totalStudents === 0 ? 0 : Math.round((distribution.COMPLETADO / totalStudents) * 100)}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="analytics-grid">
                <div className="admin-panel-card analytics-card">
                    <h3 className="panel-card-title">Distribución de Estados</h3>
                    <div className="donut-chart-wrapper" style={{ minHeight: '300px' }}>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <p className="empty-state-text">Sin inscriptos</p>}
                        <div className="donut-chart-legend vertical">
                            {pieData.map((item, idx) => (
                                <div key={idx} className="legend-item">
                                    <div className="legend-dot-square" style={{ backgroundColor: item.color }} />
                                    <span className="legend-label">{item.name} ({item.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="admin-panel-card analytics-card">
                    <h3 className="panel-card-title">Cuello de Botella (Último módulo completado)</h3>
                    <p className="panel-card-desc">Dónde se quedan estancados los alumnos En Progreso.</p>
                    <div className="chart-container" style={{ height: '300px' }}>
                        {dropoffStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dropoffStats} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="titulo" type="category" width={150} tick={{ fill: 'var(--text-primary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                                    <Bar dataKey="count" fill="var(--danger-color)" radius={[0, 4, 4, 0]} barSize={15} name="Alumnos">
                                        <LabelList dataKey="count" position="right" fill="var(--text-primary)" fontSize={12} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <p className="empty-state-text">Sin datos suficientes</p>}
                    </div>
                </div>

                <div className="admin-panel-card analytics-card full-width">
                    <h3 className="panel-card-title">Engagement de Contenido</h3>
                    <p className="panel-card-desc">Módulos completados por día de la semana.</p>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagement} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="var(--accent-color)" radius={[4, 4, 0, 0]} name="Completados">
                                    <LabelList dataKey="count" position="top" fill="var(--text-primary)" fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAnalyticsScreen;
