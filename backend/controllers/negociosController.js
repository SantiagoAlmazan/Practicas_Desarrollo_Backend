const fs = require('fs');
const path = require('path');
const csv = require('csv-parser'); // npm install csv-parser

// Array donde guardaremos las direcciones
let direcciones = [];

// Función para cargar el CSV al iniciar el servidor
function cargarDirecciones() {
  direcciones = [];
  fs.createReadStream(path.join(__dirname, 'data', 'direcciones.csv'))
    .pipe(csv())
    .on('data', (row) => {
      direcciones.push(row);
    })
    .on('end', () => {
      console.log('CSV direcciones cargado correctamente');
    })
    .on('error', (err) => {
      console.error('Error leyendo el CSV:', err);
    });
}

// Llamamos la función al inicio
cargarDirecciones();

// Controladores

// Obtener todas las direcciones
function getDirecciones(req, res) {
  res.json(direcciones);
}

// Obtener una dirección por id (suponiendo que el CSV tiene columna "id")
function getDireccionPorId(req, res) {
  const id = req.params.id;
  const direccion = direcciones.find((d) => d.id === id);
  if (direccion) {
    res.json(direccion);
  } else {
    res.status(404).json({ mensaje: 'Dirección no encontrada' });
  }
}

// Agregar nueva dirección
function agregarDireccion(req, res) {
  const nueva = req.body;

  // Puedes generar un id automático si no viene
  if (!nueva.id) {
    nueva.id = (direcciones.length + 1).toString();
  }

  direcciones.push(nueva);

  // Opcional: guardar en CSV (sobrescribir)
  const columnas = Object.keys(direcciones[0]);
  const csvContenido = [
    columnas.join(','), // header
    ...direcciones.map((d) => columnas.map((c) => d[c]).join(',')),
  ].join('\n');

  fs.writeFile(path.join(__dirname, 'data', 'direcciones.csv'), csvContenido, (err) => {
    if (err) console.error('Error guardando CSV:', err);
  });

  res.status(201).json({ mensaje: 'Dirección agregada', direccion: nueva });
}

// Exportar funciones para las rutas
module.exports = {
  getDirecciones,
  getDireccionPorId,
  agregarDireccion,
};
