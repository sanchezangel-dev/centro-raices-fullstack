const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidadController');

router.post('/', especialidadController.registrarEspecialidad);
router.get('/', especialidadController.listarEspecialidades); 
router.get('/por-area/:areaId', especialidadController.listarPorArea);
router.delete('/:id', especialidadController.eliminarEspecialidad);
router.put('/:id', especialidadController.actualizarEspecialidad);

module.exports = router;