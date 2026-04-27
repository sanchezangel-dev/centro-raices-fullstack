const pacienteService = require('../services/pacienteService');
const { handleControllerError } = require('../helpers/errorHelper');

const registrarPaciente = async (req, res) => {
    try {
        const pacienteGuardado = await pacienteService.crearPaciente(req.body);
        res.status(201).json(pacienteGuardado);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const listarPacientes = async (req, res) => {
    try {
        const pacientes = await pacienteService.obtenerTodos();
        res.status(200).json(pacientes);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const obtenerPacienteUnico = async (req, res) => {
    try {
        const paciente = await pacienteService.obtenerPorId(req.params.id);
        if (!paciente) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        res.json(paciente);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const editarPaciente = async (req, res) => {
    try {
        const actualizado = await pacienteService.actualizarPaciente(req.params.id, req.body);
        if (!actualizado) return res.status(404).json({ mensaje: 'Paciente no encontrado' });
        res.json(actualizado);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const borrarPaciente = async (req, res) => {
    try {
        await pacienteService.eliminarPaciente(req.params.id);
        res.json({ mensaje: 'Paciente dado de baja' });
    } catch (error) {
        handleControllerError(res, error); 
    }
};

module.exports = {
    registrarPaciente,
    listarPacientes,
    obtenerPacienteUnico,
    editarPaciente,
    borrarPaciente
};