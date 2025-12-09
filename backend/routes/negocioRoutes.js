const express = require('express');
const router = express.Router();
const negociosController = require('../controllers/negociosController');

// Ruta para obtener todas las direcciones
router.get('/', negociosController.getDirecciones);

// Ruta para obtener una dirección por id
router.get('/:id', negociosController.getDireccionPorId);

// Ruta para agregar una nueva dirección
router.post('/', negociosController.agregarDireccion);

module.exports = router;
