const Paciente = require('../models/pacienteModel');

const crearPaciente = async (datosPaciente) => {
    try {
        const nuevoPaciente = new Paciente(datosPaciente);
        return await nuevoPaciente.save();
    } catch (error) {
        if (error.code === 11000) throw new Error('El DNI ya está registrado');
        throw new Error('Error al crear el paciente: ' + error.message);
    }
};

const obtenerTodos = async () => {
    return await Paciente.find({ activo: true }).sort({ apellido: 1 });
};

const obtenerPorId = async (id) => {
    return await Paciente.findById(id);
};

const actualizarPaciente = async (id, datosNuevos) => {
    return await Paciente.findByIdAndUpdate(id, datosNuevos, { new: true, runValidators: true });
};

const eliminarPaciente = async (id) => {
    return await Paciente.findByIdAndUpdate(id, { activo: false }, { new: true });
};

const buscarPorDni = async (dni) => {
    return await Paciente.findOne({ dni, activo: true });
};

module.exports = {
    crearPaciente, 
    obtenerTodos, 
    obtenerPorId, 
    actualizarPaciente, 
    eliminarPaciente,
    buscarPorDni
};