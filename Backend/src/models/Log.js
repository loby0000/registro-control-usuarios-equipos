const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  accion: { type: String, required: true },
  usuario: { type: String, required: true },
  rol: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  detalles: { type: Object }
});

module.exports = mongoose.model('Log', logSchema);
