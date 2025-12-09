const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Array donde se guardarán las direcciones
const direcciones = [];
const csvPath = path.join(__dirname, 'direcciones.csv'); // CSV en la misma carpeta

// Verificar que el CSV exista antes de leerlo
if (fs.existsSync(csvPath)) {
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => direcciones.push(row))
    .on('end', () => console.log('CSV cargado correctamente'))
    .on('error', (err) => console.error('Error al leer el CSV:', err));
} else {
  console.error('Archivo CSV no encontrado en:', csvPath);
}

// Ruta del log de búsquedas
const logPath = path.join(__dirname, '../log/busquedas.log');

// Endpoint para obtener direcciones filtradas
router.get('/', (req, res) => {
  const { term, cod_postal, tipo } = req.query;

  // Guardar búsqueda en log
  const logEntry = `${new Date().toISOString()} | term: ${term || '-'} | cod_postal: ${cod_postal || '-'} | tipo: ${tipo || '-'}\n`;
  fs.appendFile(logPath, logEntry, (err) => { if (err) console.error(err); });

  // Filtrado de direcciones
  const filtered = direcciones.filter(d => {
    const matchTerm = term ? 
      (d.nom_estab.toLowerCase().includes(term.toLowerCase()) || 
       d.tipoCenCom.toLowerCase().includes(term.toLowerCase())) 
      : true;
    const matchCp = cod_postal ? String(d.cod_postal).trim() === cod_postal : true;
    const matchTipo = tipo ? d.tipoCenCom.toLowerCase().includes(tipo.toLowerCase()) : true;
    return matchTerm && matchCp && matchTipo;
  });

  res.json(filtered);
});

module.exports = router;
