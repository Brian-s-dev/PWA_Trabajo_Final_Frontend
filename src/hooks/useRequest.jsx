import { useState } from 'react';

const useRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (requestPromise) => {
        try {
            setLoading(true);
            setError(null);

            const response = await requestPromise;
            return response;

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocurrió un error inesperado';
            setError(errorMessage);
            throw err;

        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error };
};

export default useRequest;