import React from 'react';

const LogoIcon = ({ size = 24, color = "currentColor", strokeWidth = 3 }) => {
    return (
        <svg viewBox="0 0 40 40" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
            <text 
                x="50%" 
                y="50%" 
                dominantBaseline="central" 
                textAnchor="middle" 
                fill="transparent" 
                stroke={color} 
                strokeWidth={strokeWidth} 
                fontFamily="Inter, sans-serif" 
                fontSize="28" 
                fontWeight="800"
            >
                S
            </text>
        </svg>
    );
};

export default LogoIcon;
