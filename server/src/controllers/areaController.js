const areaService = require('../services/areaService');
const { handleControllerError } = require('../helpers/errorHelper');

const registrarArea = async (req, res) => {
    try {
        const guardado = await areaService.crearArea(req.body);
        res.status(201).json(guardado);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const listarAreas = async (req, res) => {
    try {
        const areas = await areaService.obtenerTodas();
        res.status(200).json(areas);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const actualizarArea = async (req, res) => {
    try {
        const areaActualizada = await areaService.actualizarArea(req.params.id, req.body);
        if (!areaActualizada) return res.status(404).json({ mensaje: "Área no encontrada" });
        
        res.json({ mensaje: "Área actualizada con éxito", datos: areaActualizada });
    } catch (error) {
        handleControllerError(res, error);
    }
};

const eliminarArea = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminada = await areaService.eliminarArea(id);

        if (!eliminada) {
            return res.status(404).json({ mensaje: "Área no encontrada" });
        }

        res.json({ mensaje: "Área eliminada físicamente de la base de datos" });
    } catch (error) {
        handleControllerError(res, error);
    }
};

module.exports = { 
    registrarArea, 
    listarAreas, 
    actualizarArea,
    eliminarArea 
};