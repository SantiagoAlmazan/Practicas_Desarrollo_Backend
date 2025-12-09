// Inicializar mapa
const map = L.map('map').setView([23.6345, -102.5528], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let direcciones = [];
let marcadorActual = null;
let lineaRuta = null;

// Cargar direcciones desde backend
async function cargarDirecciones() {
  try {
    const res = await fetch('/direcciones');
    if (!res.ok) throw new Error('Error al cargar direcciones');
    direcciones = await res.json();
    mostrarResultados(direcciones);
  } catch (err) {
    console.error(err);
  }
}

// Mostrar lista
function mostrarResultados(data) {
  const list = document.getElementById('resultsList');
  const count = document.getElementById('resultCount');
  list.innerHTML = '';
  data.forEach(d => {
    const li = document.createElement('li');
    li.textContent = `${d.nom_estab} - ${d.tipoCenCom}`;
    li.addEventListener('click', () => mostrarUbicacion(d));
    list.appendChild(li);
  });
  count.textContent = data.length;
}

// Mostrar un marcador
function mostrarUbicacion(d) {
  const lat = parseFloat(d.latitud);
  const lng = parseFloat(d.longitud);
  if (isNaN(lat) || isNaN(lng)) return;

  if (marcadorActual) map.removeLayer(marcadorActual);

  marcadorActual = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`
      <b>${d.nom_estab}</b><br>
      Tipo: ${d.tipoCenCom}<br>
      Municipio: ${d.municipio}<br>
      Estado: ${d.entidad}<br>
      CP: ${d.cod_postal}
    `)
    .openPopup();

  map.setView([lat, lng], 15);

  // Si tenemos línea anterior, recalcular hacia el negocio seleccionado
  if (navigator.geolocation && navigator.geolocation.watchPosition) {
    navigator.geolocation.getCurrentPosition(pos => {
      dibujarLinea([pos.coords.latitude, pos.coords.longitude], [lat, lng]);
    });
  }
}

// Dibujar línea entre usuario y negocio
function dibujarLinea(userCoords, bizCoords) {
  if (lineaRuta) map.removeLayer(lineaRuta);
  lineaRuta = L.polyline([userCoords, bizCoords], { color: 'blue', weight: 3 }).addTo(map);
  const bounds = L.latLngBounds([userCoords, bizCoords]);
  map.fitBounds(bounds, { padding: [50, 50] });
}

// Calcular la distancia (Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Obtener negocio más cercano
function mostrarNegocioMasCercano() {
  if (!navigator.geolocation) { alert("Geolocalización no soportada"); return; }

  navigator.geolocation.getCurrentPosition(pos => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    let minDist = Infinity;
    let nearest = null;
    direcciones.forEach(d => {
      const lat = parseFloat(d.latitud);
      const lng = parseFloat(d.longitud);
      if (!isNaN(lat) && !isNaN(lng)) {
        const dist = calcularDistancia(userLat, userLng, lat, lng);
        if (dist < minDist) { minDist = dist; nearest = d; }
      }
    });

    if (!nearest) return alert("No hay negocios válidos");
    mostrarUbicacion(nearest);
    dibujarLinea([userLat, userLng], [parseFloat(nearest.latitud), parseFloat(nearest.longitud)]);
  });
}

// Aplicar filtros en tiempo real
async function aplicarFiltros() {
  const term = document.getElementById('inputSearch').value.trim();
  const cpFilter = document.getElementById('filterCp').value.trim();
  const actFilter = document.getElementById('filterAct').value.trim();

  const query = new URLSearchParams({ term, cod_postal: cpFilter, tipo: actFilter });
  try {
    const res = await fetch('/direcciones?' + query.toString());
    if (!res.ok) throw new Error('Error al filtrar direcciones');
    const filtered = await res.json();
    mostrarResultados(filtered);
    if (filtered.length > 0) mostrarUbicacion(filtered[0]);
    else if (marcadorActual) { map.removeLayer(marcadorActual); marcadorActual = null; }
  } catch (err) {
    console.error(err);
  }
}

// Eventos
document.getElementById('inputSearch').addEventListener('input', aplicarFiltros);
document.getElementById('filterCp').addEventListener('input', aplicarFiltros);
document.getElementById('filterAct').addEventListener('input', aplicarFiltros);
document.getElementById('btnClear').addEventListener('click', () => {
  document.getElementById('inputSearch').value = '';
  document.getElementById('filterCp').value = '';
  document.getElementById('filterAct').value = '';
  mostrarResultados(direcciones);
  if (marcadorActual) { map.removeLayer(marcadorActual); marcadorActual = null; }
});

// Botón obtener mi posición
document.getElementById('btnGetMyPos').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 15);
    if (marcadorActual) map.removeLayer(marcadorActual);
    marcadorActual = L.marker([latitude, longitude]).addTo(map).bindPopup("Tú estás aquí").openPopup();
  });
});

// Botón ruta al negocio más cercano
const btnRuta = document.createElement('button');
btnRuta.textContent = "Ruta al negocio más cercano";
btnRuta.style.marginLeft = '8px';
document.querySelector('.top-buttons').appendChild(btnRuta);
btnRuta.addEventListener('click', mostrarNegocioMasCercano);

// Exportar PNG, Excel y PDF (igual que antes)
document.getElementById('btnExportPNG').addEventListener('click', () => {
  html2canvas(document.getElementById('map')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'mapa.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});
document.getElementById('btnExportExcel').addEventListener('click', () => {
  const ws = XLSX.utils.json_to_sheet(direcciones);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Direcciones');
  XLSX.writeFile(wb, 'direcciones.xlsx');
});
document.getElementById('btnExportPDF').addEventListener('click', () => {
  html2canvas(document.body).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('mapa.pdf');
  });
});

// Inicializar
cargarDirecciones();
