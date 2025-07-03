const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  equipos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipo'
    }
  ],
  tipo_registro: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  guardia_responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guardia',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Registro', registroSchema);