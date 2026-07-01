import ENVIRONMENT from '../config/environment.js';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Crea un nuevo módulo dentro de un curso específico.
 * @param {string} course_id - ID del curso padre.
 * @param {Object} moduleData - Datos del módulo (título, contenido, etc).
 * @returns {Promise<Object>} El módulo recién creado.
 * @throws {Error} Si falla la creación.
 */
export const createModuleService = async (course_id, moduleData) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${course_id}/modules`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(moduleData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al crear el módulo');
    return data;
};

/**
 * Obtiene todos los módulos pertenecientes a un curso.
 * @param {string} course_id - ID del curso.
 * @returns {Promise<Array>} Lista de módulos.
 * @throws {Error} Si ocurre un error al obtenerlos.
 */
export const getCourseModulesService = async (course_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${course_id}/modules`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los módulos');
    return data;
};

/**
 * Actualiza la información de un módulo existente.
 * @param {string} course_id - ID del curso.
 * @param {string} module_id - ID del módulo a actualizar.
 * @param {Object} moduleData - Nuevos datos del módulo.
 * @returns {Promise<Object>} El módulo actualizado.
 * @throws {Error} Si falla la actualización.
 */
export const updateModuleService = async (course_id, module_id, moduleData) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${course_id}/modules/${module_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(moduleData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar el módulo');
    return data;
};

/**
 * Elimina un módulo de un curso.
 * @param {string} course_id - ID del curso.
 * @param {string} module_id - ID del módulo a eliminar.
 * @param {boolean} [isHard=false] - Indica si el borrado es definitivo.
 * @returns {Promise<Object>} Confirmación de borrado.
 * @throws {Error} Si falla el borrado del módulo.
 */
export const deleteModuleService = async (course_id, module_id, isHard = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${course_id}/modules/${module_id}?hard=${isHard}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar el módulo');
    return data;
};
