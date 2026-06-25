import ENVIRONMENT from '../config/environment';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAdminStatsService = async () => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/stats/admin`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener métricas');
    return data;
};
