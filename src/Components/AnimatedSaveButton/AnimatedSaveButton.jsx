import React from 'react';
import { Check } from 'lucide-react';
import './AnimatedSaveButton.css';

const AnimatedSaveButton = ({
    isSaving,
    isSuccess,
    defaultText = "Guardar",
    savingText = "Guardando...",
    className = "btn-primary",
    onClick,
    disabled,
    type = "button",
    form,
    icon: Icon
}) => {

    return (
        <button
            type={type}
            form={form}
            className={`animated-save-btn ${className} ${isSaving ? 'saving' : ''} ${isSuccess ? 'success' : ''}`}
            onClick={onClick}
            disabled={disabled || isSaving || isSuccess}
        >
            <div className="btn-content">
                {isSuccess ? (
                    <Check size={18} className="check-icon" />
                ) : (
                    <>
                        {Icon && !isSaving && <Icon size={16} className="btn-icon-left" />}
                        {isSaving ? savingText : defaultText}
                    </>
                )}
            </div>
            {isSaving && <div className="progress-bg"></div>}
        </button>
    );
};

export default AnimatedSaveButton;
