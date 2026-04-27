const especialidadService = require('../services/especialidadService');

const registrarEspecialidad = async (req, res) => {
    try {
        const guardado = await especialidadService.crearEspecialidad(req.body);
        res.status(201).json(guardado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const listarEspecialidades = async (req, res) => {
    try {
        const lista = await especialidadService.obtenerTodas();
        res.json(lista);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const listarPorArea = async (req, res) => {
    try {
        const lista = await especialidadService.obtenerPorArea(req.params.areaId);
        res.json(lista);
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

const eliminarEspecialidad = async (req, res) => {
    try {
        await especialidadService.eliminarEspecialidad(req.params.id);
        res.json({ mensaje: 'Especialidad eliminada' });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const actualizarEspecialidad = async (req, res) => {
    try {
        const actualizado = await especialidadService.actualizarEspecialidad(req.params.id, req.body);
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

module.exports = {
    registrarEspecialidad,
    listarEspecialidades,
    listarPorArea,
    eliminarEspecialidad,
    actualizarEspecialidad
};