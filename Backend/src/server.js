require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error conexión MongoDB:', err));

// Rutas de prueba
app.get('/', (req, res) => {
  res.send('🚀 API funcionando');
});

// TODO: Importar rutas reales aquí
// app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const guardiaRoutes = require('./routes/guardiaRoutes');
app.use('/api/guardia', guardiaRoutes); 

const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuario', usuarioRoutes);

const guardiaAuthRoutes = require('./routes/guardiaAuthRoutes');
app.use('/api/guardia-auth', guardiaAuthRoutes); 

const historialRoutes = require('./routes/historialRoutes');
app.use('/api/historial', historialRoutes);

const exportHistorialRoutes = require('./routes/exportHistorialRoutes');
app.use('/api/exportar', exportHistorialRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const notificacionesRoutes = require('./routes/notificacionesRoutes');
app.use('/api/notificaciones', notificacionesRoutes);

const notificacionRoutes = require('./routes/notificacionRoutes');
app.use('/api/notificaciones', notificacionRoutes);

// Iniciar tareas programadas (cron)
require('./cron/index');

// Iniciar cron de notificaciones automáticas
const cron = require('node-cron');
const verificarEntradasSinSalida = require('./tasks/verificarEntradasSinSalida');
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Ejecutando verificación de usuarios dentro por tiempo prolongado...');
  await verificarEntradasSinSalida();
});
