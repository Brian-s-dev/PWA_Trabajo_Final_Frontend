import ENVIRONMENT from '../config/environment';

<<<<<<< HEAD
/**
 * Envía un archivo PDF al backend para generar un curso automáticamente mediante IA.
 * @param {File} file - Objeto File que representa el documento PDF a analizar.
 * @returns {Promise<Object>} Datos del curso generado.
 * @throws {Error} Si la petición falla o la respuesta no es OK.
 */
=======
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
export const generateCourseFromPdfService = async (file) => {
    const token = sessionStorage.getItem('access_token');
    
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(`${ENVIRONMENT.URL_API}/ai/generate-course`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
<<<<<<< HEAD
=======
            // No seteamos Content-Type, fetch lo hace automáticamente con el boundary para FormData
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
        },
        body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al generar el curso con IA');
    
    return data;
};
