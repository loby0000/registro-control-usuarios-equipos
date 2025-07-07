const Usuario = require('../models/Usuario');
const Equipo = require('../models/Equipo');
const Historial = require('../models/Registro');
const Guardia = require('../models/Guardia');
const Log = require('../models/Log');

const startOfDay = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};
const endOfDay = () => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now;
};

exports.getResumen = async (req, res) => {
  try {
    // Entradas del día
    const entradasHoy = await Historial.countDocuments({
      tipo: 'entrada',
      fecha: { $gte: startOfDay(), $lte: endOfDay() }
    });
    // Salidas del día
    const salidasHoy = await Historial.countDocuments({
      tipo: 'salida',
      fecha: { $gte: startOfDay(), $lte: endOfDay() }
    });
    // Usuarios actualmente dentro (entrada sin salida)
    const usuariosDentro = await Historial.aggregate([
      { $sort: { fecha: 1 } },
      { $group: { _id: "$usuario", ultimo: { $last: "$tipo" } } },
      { $match: { ultimo: 'entrada' } },
      { $count: "total" }
    ]);
    // Equipos actualmente dentro (entrada sin salida)
    const equiposDentro = await Historial.aggregate([
      { $match: { equipo: { $exists: true, $ne: null } } },
      { $sort: { fecha: 1 } },
      { $group: { _id: "$equipo", ultimo: { $last: "$tipo" } } },
      { $match: { ultimo: 'entrada' } },
      { $count: "total" }
    ]);
    // Guardias activos (jornada activa)
    const guardiasActivos = await Guardia.countDocuments({ jornada: { $in: ['mañana', 'tarde', 'noche'] } });
    // Intentos fallidos de login (logs)
    const intentosFallidos = await Log.countDocuments({ accion: /LOGIN/i, detalles: { $regex: /fallido|incorrecta|inválida/i } });

    res.json({
      entradasHoy,
      salidasHoy,
      usuariosDentro: usuariosDentro[0]?.total || 0,
      equiposDentro: equiposDentro[0]?.total || 0,
      guardiasActivos,
      intentosFallidos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener resumen de dashboard' });
  }
};
