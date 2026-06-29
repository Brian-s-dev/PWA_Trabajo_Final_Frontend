import ENVIRONMENT from '../config/environment';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAllUsersService = async (includeInactive = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/users${includeInactive ? '?includeInactive=true' : ''}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios');
    return data;
};

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

export const deleteUserService = async (id, isHard = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/users/${id}?hard=${isHard}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar usuario');
    return data;
};
