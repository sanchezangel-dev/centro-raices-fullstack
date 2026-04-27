const User = require('../models/userModel');

const registrar = async (datos) => {
    return await User.create(datos);
};

const login = async (email, password) => {
    const usuario = await User.findOne({ email }).select('+password');
    if (!usuario) throw new Error('Usuario no encontrado');

    const esValido = await usuario.compararPassword(password);
    if (!esValido) throw new Error('Contraseña incorrecta');

    return usuario;
};

const actualizar = async (id, datos) => {
    const usuario = await User.findById(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    
    if (datos.password) usuario.password = datos.password;
    Object.assign(usuario, datos);
    
    return await usuario.save();
};

const obtenerTodos = async () => await User.find().select('-password');

const eliminar = async (id) => await User.findByIdAndDelete(id);

module.exports = { 
    registrar, 
    login, 
    obtenerTodos, 
    actualizar, 
    eliminar 
};