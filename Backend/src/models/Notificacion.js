const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  mensaje: { type: String, required: true },
  tipo: { type: String, required: true }, // ejemplo: 'alerta', 'info', 'sistema'
  fecha: { type: Date, default: Date.now },
  leida: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notificacion', notificacionSchema);
