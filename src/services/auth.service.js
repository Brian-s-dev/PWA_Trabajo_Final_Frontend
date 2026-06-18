import axiosInstance from '../config/axios.js';

export const loginService = async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
};

export const registerService = async (nombre, email, password, rol) => {
    const response = await axiosInstance.post('/auth/register', { nombre, email, password, rol });
    return response.data;
};

export const verifyEmailService = async (token) => {
    const response = await axiosInstance.get('/auth/verify-email', {
        params: { verification_token: token }
    });
    return response.data;
};