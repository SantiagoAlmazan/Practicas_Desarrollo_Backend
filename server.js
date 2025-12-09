const express = require('express');
const cors = require('cors');
const path = require('path');

// Rutas
const negocioRoutes = require('./backend/routes/negocioRoutes'); 
const direccionesRoutes = require('./backend/controllers/data/direcciones'); // ahora direcciones.js está en data

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Servir archivos estáticos (frontend en /public)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Endpoints
app.use('/excel/negocio', negocioRoutes);
app.use('/direcciones', direccionesRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
