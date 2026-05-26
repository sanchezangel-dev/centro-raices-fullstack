import React from 'react';
import '../../styles/common/Toast.css'; // Apuntamos a los estilos creados

// Mapeo de íconos SVG limpios y personalizados para cada tipo de mensaje
const ICONOS = {
    exito: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    error: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
    ),
    advertencia: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
    ),
    info: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e88e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    )
};

const Toast = ({ mensaje, tipo }) => {
    // Si no hay mensaje, no renderizamos absolutamente nada de forma segura
    if (!mensaje) return null;

    // Seleccionamos el SVG correspondiente o uno por defecto si falla el tipo
    const iconoAEscupir = ICONOS[tipo] || ICONOS.info;

    return (
        <div className="toast-container-global">
            <div className={`toast-global ${tipo || 'info'}`}>
                <div className="toast-icon-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                    {iconoAEscupir}
                </div>
                <span>{mensaje}</span>
            </div>
        </div>
    );
};

export default Toast;