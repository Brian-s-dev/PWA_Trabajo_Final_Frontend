import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './SplashScreen.css';

const SplashScreen = () => {
    const navigate = useNavigate();
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setIsLeaving(true);
        }, 4000);

        const timer2 = setTimeout(() => {
            navigate('/login');
        }, 4500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [navigate]);

    return (
        <div className={`splash-container ${isLeaving ? 'splash-leave' : ''}`}>
            <div className="logo-container">
                <svg className="logo-svg" viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg">
                    <text x="30" y="76" className="logo-full-text">
                        <tspan className="logo-s-text">S</tspan>
                        {'killFlow'.split('').map((char, index) => (
                            <tspan key={index} className="logo-letter" style={{ animationDelay: `${1.8 + (index * 0.1)}s` }}>
                                {char}
                            </tspan>
                        ))}
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default SplashScreen;
