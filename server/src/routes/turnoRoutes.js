const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

router.get('/', turnoController.listarPorDia);
router.post('/admision', turnoController.agendarAdmision);
router.post('/plan-tratamiento', turnoController.generarPlan);
router.put('/:id', turnoController.editarTurno); 
router.patch('/:id/estado', turnoController.cambiarEstado);
router.delete('/plan/:planId', turnoController.eliminarPlan);


module.exports = router;