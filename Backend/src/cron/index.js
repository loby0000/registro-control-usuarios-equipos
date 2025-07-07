const cron = require('node-cron');
const revisarEntradasSinSalida = require('./notificacionesCron');

console.log('⏰ Cron de notificaciones automáticas INICIADO');

// Ejecuta cada 2 minutos
cron.schedule('*/2 * * * *', async () => {
  console.log('Ejecutando revisión de usuarios dentro por tiempo prolongado...');
  await revisarEntradasSinSalida();
});
