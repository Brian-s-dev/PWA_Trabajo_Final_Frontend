import ENVIRONMENT from '../config/environment.js';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getAllCoursesService = async (includeInactive = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses${includeInactive ? '?includeInactive=true' : ''}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los cursos');
    return data;
};

export const getCourseByIdService = async (id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener el curso');
    return data;
};

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

export const deleteCourseService = async (id, isHard = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${id}?hard=${isHard}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar el curso');
    return data;
};
