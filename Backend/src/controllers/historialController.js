const Registro = require('../models/Registro');
const Usuario = require('../models/Usuario');
const Equipo = require('../models/Equipo');
const Guardia = require('../models/Guardia');

exports.obtenerHistorial = async (req, res) => {
  try {
    const { usuario, serial, fechaInicio, fechaFin } = req.query;

    const filtros = {};

    if (usuario) {
      const user = await Usuario.findOne({ numero_documento: usuario });
      if (user) {
        filtros.usuario = user._id;
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }

    if (serial) {
      const equipo = await Equipo.findOne({ serial });
      if (equipo) {
        filtros.equipos = equipo._id;
      } else {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
    }

    if (fechaInicio && fechaFin) {
      filtros.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }

    const historial = await Registro.find(filtros)
      .populate('usuario', 'nombre_completo numero_documento tipo_usuario')
      .populate('equipos', 'nombre serial')
      .populate('guardia_responsable', 'nombre documento jornada')
      .sort({ fecha: -1 });

    res.status(200).json({ historial });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
};
