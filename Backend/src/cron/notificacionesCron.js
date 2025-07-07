const Notificacion = require('../models/Notificacion');
const Historial = require('../models/Registro');
const Usuario = require('../models/Usuario');

const X_HORAS = 8; // Cambia este valor según tu política

async function revisarEntradasSinSalida() {
  const limite = new Date(Date.now() - X_HORAS * 60 * 60 * 1000);
  // Usuarios con última acción 'entrada' y sin salida posterior
  const usuariosDentro = await Historial.aggregate([
    { $sort: { fecha: 1 } },
    { $group: { _id: "$usuario", ultimo: { $last: "$tipo" }, fechaUltima: { $last: "$fecha" } } },
    { $match: { ultimo: 'entrada', fechaUltima: { $lte: limite } } }
  ]);
  for (const u of usuariosDentro) {
    await Notificacion.create({
      titulo: 'Usuario dentro por tiempo prolongado',
      mensaje: `El usuario ${u._id} lleva más de ${X_HORAS} horas dentro del edificio.`,
      tipo: 'alerta',
      fecha: new Date(),
      leida: false
    });
  }
}

module.exports = revisarEntradasSinSalida;
