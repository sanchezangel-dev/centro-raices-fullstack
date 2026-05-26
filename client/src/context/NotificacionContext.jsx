import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from '../components/Common/Toast'; // Importamos el componente visual que creamos recién

const NotificacionContext = createContext();

export const NotificacionProvider = ({ children }) => {
    const [notificacion, setNotificacion] = useState({
        visible: false,
        mensaje: '',
        tipo: 'info'
    });

    const mostrarAviso = useCallback((mensaje, tipo = 'info') => {
        setNotificacion({
            visible: true,
            mensaje,
            tipo
        });

        // 3500ms = 3.5 segundos flotando en pantalla
        setTimeout(() => {
            setNotificacion(prev => ({ ...prev, visible: false }));
        }, 3500);
    }, []);

    return (
        <NotificacionContext.Provider value={{ mostrarAviso }}>
            {children}
            {notificacion.visible && (
                <Toast mensaje={notificacion.mensaje} tipo={notificacion.tipo} />
            )}
        </NotificacionContext.Provider>
    );
};

export const useNotificacion = () => {
    const context = useContext(NotificacionContext);
    if (!context) {
        throw new Error('useNotificacion debe ser usado dentro de un NotificacionProvider');
    }
    return context;
};