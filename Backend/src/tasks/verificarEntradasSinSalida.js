const Notificacion = require('../models/Notificacion');
const Historial = require('../models/Registro');
const enviarNotificacionMail = require('../mailer');

const X_HORAS = 8; // Cambia este valor según tu política
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function verificarEntradasSinSalida() {
  const limite = new Date(Date.now() - X_HORAS * 60 * 60 * 1000);
  const usuariosDentro = await Historial.aggregate([
    { $sort: { fecha: 1 } },
    { $group: { _id: "$usuario", ultimo: { $last: "$tipo" }, fechaUltima: { $last: "$fecha" } } },
    { $match: { ultimo: 'entrada', fechaUltima: { $lte: limite } } }
  ]);
  for (const u of usuariosDentro) {
    const noti = await Notificacion.create({
      titulo: 'Usuario dentro por tiempo prolongado',
      mensaje: `El usuario ${u._id} lleva más de ${X_HORAS} horas dentro del edificio.`,
      tipo: 'ALERTA',
      fecha: new Date(),
      leida: false
    });
    // Opcional: enviar correo
    if (ADMIN_EMAIL) {
      await enviarNotificacionMail({
        to: ADMIN_EMAIL,
        subject: noti.titulo,
        text: noti.mensaje
      });
    }
  }
  if (usuariosDentro.length > 0) {
    console.log(`🔔 Notificaciones automáticas generadas: ${usuariosDentro.length}`);
  }
}

module.exports = verificarEntradasSinSalida;
