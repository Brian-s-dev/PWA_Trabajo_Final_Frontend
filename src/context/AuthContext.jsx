import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        const storedToken = sessionStorage.getItem('access_token');
        const storedUser = sessionStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, userToken) => {
        sessionStorage.setItem('access_token', userToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const updateUser = (updatedData) => {
        const newData = { ...user, ...updatedData };
        sessionStorage.setItem('user', JSON.stringify(newData));
        setUser(newData);
    };

<<<<<<< HEAD
    // configuracion para el timeout del usuario
=======
    // Inactividad: desloguear después de 5 minutos (300000 ms)
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            if (user) {
                timeoutId = setTimeout(() => {
                    logout();
                }, 300000);
            }
        };

        const events = ['mousemove', 'keydown', 'scroll', 'click'];

        if (user) {
            resetTimer();
            events.forEach(event => window.addEventListener(event, resetTimer));
        }

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [user]);

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};
