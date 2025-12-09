 Proyecto Backend - Negocios y Mapa

## Alumno
**Santiago Isaias Almazan Chavez**  
Número de control: b18210451  

## Fecha
8 de diciembre de 2025  

---

## Descripción del proyecto
Este proyecto implementa un **sistema de gestión de negocios** con:
- Backend en **Node.js** y **Express.js**.
- Datos de negocios cargados desde un **archivo CSV** (`direcciones.csv`) y respaldados en **SQLite**.
- Frontend con **HTML, CSS y JavaScript**.
- **Mapa interactivo** con Leaflet que muestra la ubicación de los negocios filtrados.
- Registro de búsquedas en un archivo de log (`busquedas.log`).
- Exportaciones de resultados a **PNG**, **Excel** y **PDF**.

El proyecto permite filtrar negocios por nombre, código postal o tipo de actividad, y optimiza la visualización para no sobrecargar el navegador.

---

## Estructura del proyecto

Proyecto Backend/
│
├─ backend/
│ ├─ data/
│ │ ├─ direcciones.js # Lógica para cargar CSV y filtrar direcciones
│ │ └─ direcciones.csv # Datos de negocios
│ ├─ routes/
│ │ ├─ negocioRoutes.js # Endpoints relacionados a negocios
│ │ └─ direcciones.js # Endpoint para filtrar direcciones
│ ├─ controllers/ # (Opcional: si se agregan controladores)
│ └─ log/
│ └─ busquedas.log # Registro de búsquedas realizadas
│
├─ public/
│ ├─ index.html # Interfaz del usuario
│ └─ app.js # Lógica de frontend (mapa, filtros, exportaciones)
│
└─ server.js # Configuración del servidor Express

markdown
Copiar código

---

## Funcionamiento del backend

### `server.js`
- Configura **Express** y permite **CORS**.
- Sirve archivos estáticos desde `/public`.
- Define endpoints:
  - `/direcciones`: filtra negocios usando el CSV (`direcciones.csv`) según `term`, `cod_postal` o `tipo`.
  - `/excel/negocio`: endpoint para exportar datos de negocios (implementado previamente).
- Inicia servidor en **puerto 3000**.

### `direcciones.js` (en `backend/data`)
- Lee `direcciones.csv` y carga las filas en memoria usando `csv-parser`.
- Filtra los resultados según query params:
  - `term` → nombre del establecimiento o tipo de centro comercial.
  - `cod_postal` → código postal.
  - `tipo` → tipo de negocio.
- Registra cada búsqueda en `log/busquedas.log` con fecha y parámetros.
- Devuelve JSON con las direcciones filtradas y sus coordenadas (`latitud` y `longitud`).

---

## Funcionamiento del frontend

### `index.html`
- Contiene:
  - Barra de búsqueda y filtros.
  - Resultados en lista.
  - Mapa de Leaflet.
  - Botones para exportar datos a PNG, Excel y PDF.
  - Gráfica de Chart.js (estadísticas de los resultados).

### `app.js`
- Se conecta a `/direcciones` para obtener los negocios filtrados.
- Filtra la lista según el término y código postal.
- Muestra **solo un marker** por búsqueda para evitar lentitud en el navegador.
- Traza una línea desde la posición del usuario hasta el negocio más cercano.
- Permite exportar los resultados:
  - PNG → imagen del mapa y lista.
  - Excel → tabla de negocios.
  - PDF → reporte completo.

---

## Problemas resueltos
1. **Lentitud del navegador:** al mostrar miles de markers, la página se congelaba. Se solucionó mostrando solo un marker por búsqueda.
2. **Rutas al CSV:** Node no encontraba `direcciones.csv`. Se corrigió usando `path.join(__dirname, 'direcciones.csv')` y asegurando la ubicación correcta.
3. **Bloqueo de almacenamiento por Tracking Prevention:** la funcionalidad del mapa no se afectó, solo avisos en consola.

---

## Uso del proyecto

1. Clonar el repositorio.
2. Instalar dependencias:
```bash
npm install express cors csv-parser
Ejecutar el servidor:

bash
Copiar código
node server.js
Abrir en el navegador:

arduino
Copiar código
http://localhost:3000
Usar la barra de búsqueda y filtros para mostrar negocios en el mapa.

Exportar los resultados según sea necesario.

Conclusiones
Se implementó un flujo completo backend + frontend para gestión de negocios.

Se integró Leaflet para visualización geográfica.

Se aprendió a:

Leer CSV y filtrar datos dinámicamente.

Registrar búsquedas.

Optimizar renderizado de mapas.

Exportar resultados a diferentes formatos.

El sistema es escalable para migrar a una base de datos completa si es necesario.
