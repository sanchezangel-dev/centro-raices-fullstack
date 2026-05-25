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
    return await Paciente.find({}).sort({ apellido: 1 });
};

const obtenerPorId = async (id) => {
    return await Paciente.findById(id);
};

const actualizarPaciente = async (id, datosNuevos) => {
    return await Paciente.findByIdAndUpdate(id, datosNuevos, { new: true, runValidators: true });
};

// Tu baja lógica perfecta que ya tenías armada
const eliminarPaciente = async (id) => {
    return await Paciente.findByIdAndUpdate(id, { activo: false }, { new: true });
};

// 2. LIBERAMOS LA BÚSQUEDA POR DNI PARA PODER RECUPERAR PACIENTES VIEJOS
const buscarPorDni = async (dni) => {
    return await Paciente.findOne({ dni });
};

module.exports = {
    crearPaciente, 
    obtenerTodos, 
    obtenerPorId, 
    actualizarPaciente, 
    eliminarPaciente,
    buscarPorDni
};