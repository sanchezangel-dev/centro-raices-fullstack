const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verificarToken = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ mensaje: "No hay token, autorización denegada" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'palabra_secreta_raices');
        
        const usuario = await User.findById(decoded.id).select('-password');
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        req.user = usuario; 
        next();
    } catch (error) {
        res.status(401).json({ mensaje: "Token no válido o expirado" });
    }
};

const esAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            mensaje: "Acceso denegado: Se requieren permisos de administrador." 
        });
    }
};

module.exports = { verificarToken, esAdmin };