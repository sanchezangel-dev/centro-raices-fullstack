require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const conectarDB = require('./src/config/db');

// Inicialización de la App
const app = express();

// 1. Conexión a la Base de Datos
conectarDB();

// 2. Middlewares Globales
app.use(cors()); 
app.use(express.json()); // Vital para que Thunder Client pueda mandar JSON

// 3. Importar Rutas
// Asegurate de que estos archivos existan en estas carpetas exactas
const pacienteRoutes = require('./src/routes/pacienteRoutes');
const profesionalRoutes = require('./src/routes/profesionalRoutes');
const turnoRoutes = require('./src/routes/turnoRoutes');
const areaRoutes = require('./src/routes/areaRoutes');
const especialidadRoutes = require('./src/routes/especialidadRoutes');
const userRoutes = require('./src/routes/userRoutes');

// 4. Definición de Rutas
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/profesionales', profesionalRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/users', userRoutes); // Esta es la que manejara el /login y /register

// 5. Ruta de prueba de salud del servidor
app.get('/', (req, res) => {
    res.status(200).send('Servidor de Centro Raíces funcionando 🚀');
});

// 6. Manejo de rutas no encontradas (Middleware para capturar 404)
app.use((req, res) => {
    res.status(404).json({ mensaje: `La ruta ${req.originalUrl} no fue encontrada en este servidor.` });
});

// 7. Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🔗 Localhost: http://localhost:${PORT}`);
});