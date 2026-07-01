import ENVIRONMENT from '../config/environment.js';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Obtiene la lista de todos los cursos.
 * @param {boolean} [includeInactive=false] - Si es true, incluye los cursos inactivos.
 * @returns {Promise<Object>} Objeto con el array de cursos.
 * @throws {Error} Si falla la petición.
 */
export const getAllCoursesService = async (includeInactive = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses${includeInactive ? '?includeInactive=true' : ''}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los cursos');
    return data;
};

/**
 * Obtiene los detalles de un curso específico por su ID.
 * @param {string} id - ID del curso.
 * @returns {Promise<Object>} Datos del curso solicitado.
 * @throws {Error} Si el curso no existe o falla la petición.
 */
export const getCourseByIdService = async (id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el curso');
    return data;
};

/**
 * Crea un nuevo curso.
 * @param {Object} courseData - Datos del curso a crear (titulo, descripcion, etc).
 * @returns {Promise<Object>} El curso creado.
 * @throws {Error} Si hay un error de validación o fallo del servidor.
 */
export const createCourseService = async (courseData) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(courseData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al crear el curso');
    return data;
};

/**
 * Actualiza la información de un curso existente.
 * @param {string} id - ID del curso a modificar.
 * @param {Object} courseData - Datos a actualizar.
 * @returns {Promise<Object>} El curso actualizado.
 * @throws {Error} Si el curso no se puede actualizar.
 */
export const updateCourseService = async (id, courseData) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(courseData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar el curso');
    return data;
};

/**
 * Elimina un curso del sistema.
 * @param {string} id - ID del curso a eliminar.
 * @param {boolean} [isHard=false] - Define si la eliminación es definitiva (hard delete).
 * @returns {Promise<Object>} Mensaje de confirmación de borrado.
 * @throws {Error} Si falla el borrado del curso.
 */
export const deleteCourseService = async (id, isHard = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${id}?hard=${isHard}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar el curso');
    return data;
};
