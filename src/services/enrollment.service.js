import ENVIRONMENT from '../config/environment';

const getAuthHeaders = () => {
    const token = sessionStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getMyCoursesService = async () => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/my_courses`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener mis cursos');
    return data;
};

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
export const unassignCourseService = async (employee_id, course_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/${course_id}/employee/${employee_id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al desasignar curso');
    return data;
};

export const getEmployeeCoursesService = async (employee_id) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/enrollments/employee/${employee_id}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener cursos del empleado');
    return data;
};
