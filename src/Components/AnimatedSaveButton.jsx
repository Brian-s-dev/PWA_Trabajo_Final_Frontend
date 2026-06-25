import React from 'react';
import { Check } from 'lucide-react';
import './AnimatedSaveButton.css';

/**
 * Botón animado para guardado.
 * 
 * Props:
 * - isSaving (bool): si está en proceso.
 * - isSuccess (bool): si terminó con éxito.
 * - defaultText (string): texto normal del botón.
 * - savingText (string): texto durante guardado.
 * - className (string): clases adicionales.
 * - onClick (function): manejador de click.
 * - disabled (bool): si está deshabilitado externamente.
 * - type (string): tipo de botón ('button' o 'submit').
 * - form (string): id del formulario al que pertenece.
 */
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
