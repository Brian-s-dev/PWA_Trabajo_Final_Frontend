import ENVIRONMENT from '../config/environment';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Obtiene las estadísticas generales para el panel de administración.
 * @returns {Promise<Object>} Datos estadísticos globales.
 * @throws {Error} Si falla la petición.
 */
export const getAdminStatsService = async () => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/stats/admin`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener métricas');
    return data;
};

/**
 * Obtiene analíticas específicas de un curso.
 * @param {string} courseId - ID del curso.
 * @returns {Promise<Object>} Estadísticas del curso.
 * @throws {Error} Si ocurre un error.
 */
export const getCourseAnalyticsService = async (courseId) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/stats/course/${courseId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener métricas del curso');
    return data;
};

/**
 * Obtiene analíticas específicas del rendimiento de un usuario.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Object>} Estadísticas del usuario.
 * @throws {Error} Si ocurre un error.
 */
export const getUserAnalyticsService = async (userId) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/stats/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener métricas del usuario');
    return data;
};
