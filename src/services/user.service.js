import ENVIRONMENT from '../config/environment';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

/**
 * Obtiene la lista de todos los usuarios registrados en el sistema.
 * @param {boolean} [includeInactive=false] - Define si se incluyen usuarios desactivados.
 * @returns {Promise<Object>} Lista de usuarios.
 * @throws {Error} Si falla la obtención de datos.
 */
export const getAllUsersService = async (includeInactive = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/users${includeInactive ? '?includeInactive=true' : ''}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios');
    return data;
};

/**
 * Crea un nuevo usuario manualmente desde el panel de administración.
 * @param {Object} userData - Datos del usuario (nombre, email, password, rol).
 * @returns {Promise<Object>} Datos del usuario recién creado.
 * @throws {Error} Si ocurre un error al crearlo.
 */
export const createUserService = async (userData) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al crear usuario');
    return data;
};

/**
 * Actualiza la información y/o rol de un usuario existente.
 * @param {string} id - ID del usuario.
 * @param {Object} userData - Datos a modificar.
 * @returns {Promise<Object>} Usuario actualizado.
 * @throws {Error} Si falla la actualización.
 */
export const updateUserService = async (id, userData) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar usuario');
    return data;
};

/**
 * Elimina a un usuario del sistema (requiere permisos de administrador).
 * @param {string} id - ID del usuario a eliminar.
 * @param {boolean} [isHard=false] - Indica si es un borrado definitivo en la base de datos.
 * @returns {Promise<Object>} Mensaje de confirmación.
 * @throws {Error} Si falla la eliminación.
 */
export const deleteUserService = async (id, isHard = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/users/${id}?hard=${isHard}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar usuario');
    return data;
};
