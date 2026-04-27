const Profesional = require('../models/profesionalModel');

const crearProfesional = async (datos) => {
    try {
        const nuevo = new Profesional(datos);
        return await nuevo.save();
    } catch (error) {
        if (error.code === 11000) throw new Error('El DNI ya existe');
        throw error;
    }
};

const obtenerTodos = async () => {
    return await Profesional.find({ activo: true }).sort({ apellido: 1 });
};

const obtenerPorId = async (id) => {
    const profesional = await Profesional.findById(id);
    if (!profesional) throw new Error('No encontrado');
    return profesional;
};

const actualizarProfesional = async (id, datosNuevos) => {
    return await Profesional.findByIdAndUpdate(id, datosNuevos, { new: true, runValidators: true });
};

const eliminarProfesional = async (id) => {
    return await Profesional.findByIdAndUpdate(id, { activo: false }, { new: true });
};

module.exports = { 
    crearProfesional, 
    obtenerTodos, 
    obtenerPorId, 
    actualizarProfesional, 
    eliminarProfesional 
};