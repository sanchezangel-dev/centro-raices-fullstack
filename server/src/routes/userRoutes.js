const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas de autenticación
router.post('/register', userController.registrar);
router.post('/login', userController.login);

// Rutas de gestión de usuarios
router.get('/', userController.obtenerUsuarios);
router.put('/:id', userController.actualizarUsuario);
router.delete('/:id', userController.eliminarUsuario);

module.exports = router;