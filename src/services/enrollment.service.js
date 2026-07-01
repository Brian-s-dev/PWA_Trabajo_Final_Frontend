import ENVIRONMENT from '../config/environment';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Obtiene los cursos en los que el usuario logueado está inscrito.
 * @returns {Promise<Array>} Lista de inscripciones y progreso del usuario.
 * @throws {Error} Si la petición falla.
 */
export const getMyCoursesService = async () => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/my_courses`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener mis cursos');
    return data;
};

/**
 * Inscribe a un empleado en un curso.
 * @param {string} employee_id - ID del empleado.
 * @param {string} curso_id - ID del curso.
 * @returns {Promise<Object>} Datos de la inscripción.
 * @throws {Error} Si falla la inscripción.
 */
export const assignCourseService = async (employee_id, curso_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/assign_course`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ employee_id, curso_id })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al asignar curso');
    return data;
};

/**
 * Marca un módulo específico como completado dentro de un curso.
 * @param {string} course_id - ID del curso.
 * @param {string} module_id - ID del módulo completado.
 * @returns {Promise<Object>} Progreso actualizado de la inscripción.
 * @throws {Error} Si falla la actualización.
 */
export const markModuleCompletedService = async (course_id, module_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/${course_id}/progress`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ module_id })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al marcar progreso');
    return data;
};
/**
 * Desinscribe a un empleado de un curso (baja lógica).
 * @param {string} employee_id - ID del empleado.
 * @param {string} course_id - ID del curso.
 * @returns {Promise<Object>} Mensaje de éxito.
 * @throws {Error} Si falla la desasignación.
 */
export const unassignCourseService = async (employee_id, course_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/${course_id}/employee/${employee_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al desasignar curso');
    return data;
};

/**
 * Obtiene los cursos asignados a un empleado específico.
 * @param {string} employee_id - ID del empleado.
 * @returns {Promise<Array>} Lista de inscripciones del empleado.
 * @throws {Error} Si la petición falla.
 */
export const getEmployeeCoursesService = async (employee_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/employee/${employee_id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener cursos del empleado');
    return data;
};

/**
 * Obtiene los usuarios inscritos a un curso específico.
 * @param {string} course_id - ID del curso.
 * @returns {Promise<Array>} Lista de inscripciones del curso.
 * @throws {Error} Si la petición falla.
 */
export const getCourseEnrollmentsService = async (course_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/course/${course_id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener inscripciones del curso');
    return data;
};
