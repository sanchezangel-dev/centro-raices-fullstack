const express = require('express');
const router = express.Router();
const profesionalController = require('../controllers/profesionalController');

router.post('/', profesionalController.registrarProfesional);
router.get('/', profesionalController.listarProfesionales);
router.get('/:id', profesionalController.obtenerProfesionalUnico);
router.put('/:id', profesionalController.editarProfesional);
router.delete('/:id', profesionalController.borrarProfesional);

module.exports = router;