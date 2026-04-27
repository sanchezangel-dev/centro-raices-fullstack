const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.post('/', pacienteController.registrarPaciente);
router.get('/', pacienteController.listarPacientes);
router.get('/:id', pacienteController.obtenerPacienteUnico);
router.put('/:id', pacienteController.editarPaciente);
router.delete('/:id', pacienteController.borrarPaciente);

module.exports = router;