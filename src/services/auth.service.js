import ENVIRONMENT from '../config/environment';

export const loginService = async (email, password) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data;
};

/**
 * Servicio para registrar un nuevo usuario en la plataforma
 * @param {string} nombre 
 * @param {string} email 
 * @param {string} password 
 * @param {string} rol 
 * @returns {Promise<Object>} Datos de confirmación del nuevo usuario
 */

export const registerService = async (nombre, email, password, rol) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password, rol })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
    }

    return data;
};

/**
 * Servicio para procesar el token de verificación de correo electrónico
 * @param {string} token Token extraído de la URL por la vista
 * @returns {Promise<Object>} Mensaje de éxito del backend
 */

export const verifyEmailService = async (token) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/auth/verify-email?verification_token=${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al verificar el correo electrónico');
    }

    return data;
};

export const forgotPasswordService = async (email) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al solicitar recuperación');
    return data;
};

export const resetPasswordService = async (reset_token, new_password) => {
    const response = await fetch(`${ENVIRONMENT.URL_API}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reset_token, new_password })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al restablecer contraseña');
    return data;
};

export const updateMeService = async (updateData) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${ENVIRONMENT.URL_API}/auth/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al actualizar perfil');
    return data;
};

export const uploadAvatarService = async (file) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(`${ENVIRONMENT.URL_API}/auth/me/avatar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al subir la imagen');
    return data;
};