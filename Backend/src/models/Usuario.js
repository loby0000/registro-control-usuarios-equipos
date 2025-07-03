const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  tipo_usuario: {
    type: String,
    enum: ['estudiante', 'visitante', 'colaborador', 'otro'],
    required: true
  },
  nombre_completo: {
    type: String,
    required: true
  },
  tipo_documento: {
    type: String,
    required: true
  },
  numero_documento: {
    type: String,
    required: true,
    unique: true
  },
  equipos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipo'
    }
  ]
});

module.exports = mongoose.model('Usuario', usuarioSchema);
