const mongoose = require('mongoose');

const guardiaSchema = new mongoose.Schema({
  documento: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  jornada: {
    type: String,
    enum: ['mañana', 'tarde', 'noche'],
    required: true
  },
  clave: {
    type: String,
    required: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Guardia', guardiaSchema);

