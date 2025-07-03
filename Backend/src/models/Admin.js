const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  clave: {
    type: String,
    required: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  emergencia: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Admin', adminSchema);
