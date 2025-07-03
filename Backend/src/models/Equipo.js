const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  serial: {
    type: String,
    required: true,
    unique: true
  },
  lleva_cargador: {
    type: Boolean,
    required: true
  },
  lleva_mouse: {
    type: Boolean,
    required: true
  },
  otras_caracteristicas: String,
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});

module.exports = mongoose.model('Equipo', equipoSchema);
