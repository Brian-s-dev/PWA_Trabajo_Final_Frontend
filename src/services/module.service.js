import ENVIRONMENT from '../config/environment.js';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

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

export const getCourseModulesService = async (course_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${course_id}/modules`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener los módulos');
    return data;
};

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

export const deleteModuleService = async (course_id, module_id, isHard = false) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/courses/${course_id}/modules/${module_id}?hard=${isHard}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar el módulo');
    return data;
};
