const handleControllerError = (res, error) => {
    // Si es un error de validación de Mongoose (ej: campo duplicado o faltante)
    if (error.name === 'ValidationError' || error.code === 11000) {
        return res.status(400).json({ 
            mensaje: "Datos inválidos o duplicados", 
            error: error.message 
        });
    }
    // Error genérico de servidor
    return res.status(500).json({ 
        mensaje: "Error interno del servidor", 
        error: error.message 
    });
};

module.exports = { handleControllerError };