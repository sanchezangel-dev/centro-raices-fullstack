const Especialidad = require('../models/especialidadModel');

const crearEspecialidad = async (datos) => {
    return await Especialidad.create(datos);
};

const obtenerPorArea = async (areaId) => {
    return await Especialidad.find({ area: areaId });
};

const eliminarEspecialidad = async (id) => {
    return await Especialidad.findByIdAndDelete(id);
};

const actualizarEspecialidad = async (id, data) => {
    return await Especialidad.findByIdAndUpdate(id, data, { new: true });
};

const obtenerTodas = async () => {
    return await Especialidad.find().populate('area'); 
};

module.exports = { crearEspecialidad, obtenerPorArea, eliminarEspecialidad, actualizarEspecialidad, obtenerTodas };