const profesionalService = require('../services/profesionalService');
// 1. IMPORTAMOS EL HELPER (revisá bien la ruta de carpetas de tu proyecto)
const { handleControllerError } = require('../helpers/errorHelper');

const registrarProfesional = async (req, res) => {
  try {
    const guardado = await profesionalService.crearProfesional(req.body);
    res.status(201).json(guardado);
  } catch (error) {
    // 2. USAMOS EL HELPER ACÁ EN EL CATCH
    handleControllerError(res, error);
  }
};

const listarProfesionales = async (req, res) => {
  try {
    const profesionales = await profesionalService.obtenerTodos();
    res.status(200).json(profesionales);
  } catch (error) {
    handleControllerError(res, error);
  }
};

const obtenerProfesionalUnico = async (req, res) => {
  try {
    const profesional = await profesionalService.obtenerPorId(req.params.id);
    res.status(200).json(profesional);
  } catch (error) {
    handleControllerError(res, error);
  }
};

const editarProfesional = async (req, res) => {
  try {
    const actualizado = await profesionalService.actualizarProfesional(req.params.id, req.body);
    res.status(200).json(actualizado);
  } catch (error) {
    handleControllerError(res, error);
  }
};

const borrarProfesional = async (req, res) => {
  try {
    await profesionalService.eliminarProfesional(req.params.id);
    res.status(200).json({ mensaje: 'Baja correcta' });
  } catch (error) {
    handleControllerError(res, error);
  }
};

module.exports = {
  registrarProfesional,
  listarProfesionales,
  obtenerProfesionalUnico,
  editarProfesional,
  borrarProfesional
};