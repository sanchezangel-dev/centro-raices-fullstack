const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

router.post('/', areaController.registrarArea);
router.get('/', areaController.listarAreas);
router.put('/:id', areaController.actualizarArea);
router.delete('/:id', areaController.eliminarArea);

module.exports = router;