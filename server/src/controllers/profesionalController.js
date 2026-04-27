const profesionalService = require('../services/profesionalService');

const registrarProfesional = async (req, res) => {
    try {
        const guardado = await profesionalService.crearProfesional(req.body);
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const listarProfesionales = async (req, res) => {
    try {
        const profesionales = await profesionalService.obtenerTodos();
        res.status(200).json(profesionales);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la lista' });
    }
};

const obtenerProfesionalUnico = async (req, res) => {
    try {
        const profesional = await profesionalService.obtenerPorId(req.params.id);
        res.json(profesional);
    } catch (error) {
        res.status(404).json({ mensaje: error.message });
    }
};

const editarProfesional = async (req, res) => {
    try {
        const actualizado = await profesionalService.actualizarProfesional(req.params.id, req.body);
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const borrarProfesional = async (req, res) => {
    try {
        await profesionalService.eliminarProfesional(req.params.id);
        res.json({ mensaje: 'Baja correcta' });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

module.exports = {
    registrarProfesional,
    listarProfesionales,
    obtenerProfesionalUnico,
    editarProfesional,
    borrarProfesional
};