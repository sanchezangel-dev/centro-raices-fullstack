const jwt = require('jsonwebtoken');

const generarJWT = (id) => {
    // Usamos una palabra secreta (ponela en tu .env después)
    return jwt.sign({ id }, process.env.JWT_SECRET || 'palabra_secreta_raices', {
        expiresIn: '30d' // El token dura 30 días
    });
};

module.exports = { generarJWT };