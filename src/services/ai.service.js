import ENVIRONMENT from '../config/environment';

export const generateCourseFromPdfService = async (file) => {
    const token = sessionStorage.getItem('access_token');
    
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(`${ENVIRONMENT.URL_API}/ai/generate-course`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // No seteamos Content-Type, fetch lo hace automáticamente con el boundary para FormData
        },
        body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al generar el curso con IA');
    
    return data;
};
