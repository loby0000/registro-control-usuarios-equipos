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
