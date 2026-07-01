import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, X } from 'lucide-react';
import './AiCourseModal.css';

const AiCourseModal = ({ isOpen, onClose, onGenerate }) => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
        } else {
            alert('Por favor, sube un archivo PDF válido.');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        }
    };

    const handleGenerate = async () => {
        if (!file) return;
        setIsGenerating(true);
        try {
            await onGenerate(file);
<<<<<<< HEAD
            setFile(null);
=======
            setFile(null); // Limpiar tras éxito
>>>>>>> 3317ee4c62fecb43cda44e8caaee3b0907c52ac8
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="ai-modal-content">
                <button className="ai-modal-close" onClick={onClose} disabled={isGenerating}>
                    <X size={20} />
                </button>
                
                <h3 className="ai-modal-title">Generar Curso con IA ✨</h3>
                <p className="ai-modal-subtitle">Sube un documento corporativo en PDF y Gemini creará automáticamente el curso y sus módulos.</p>
                
                {!isGenerating ? (
                    <>
                        <div 
                            className={`ai-dropzone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <input 
                                type="file" 
                                accept=".pdf" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                onChange={handleFileChange}
                            />
                            
                            {file ? (
                                <div className="file-preview">
                                    <FileText size={48} className="file-icon" />
                                    <p className="file-name">{file.name}</p>
                                    <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="dropzone-placeholder">
                                    <UploadCloud size={48} className="upload-icon" />
                                    <p>Haz clic o arrastra tu PDF aquí</p>
                                </div>
                            )}
                        </div>

                        <div className="ai-modal-actions">
                            <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                            <button 
                                className="btn-primary btn-ai" 
                                onClick={handleGenerate} 
                                disabled={!file}
                            >
                                Generar Curso
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="ai-loading-state">
                        <Loader2 size={48} className="spinner" />
                        <h4>Analizando documento...</h4>
                        <p>Gemini está leyendo el PDF y estructurando el conocimiento. Esto puede tardar unos segundos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiCourseModal;
