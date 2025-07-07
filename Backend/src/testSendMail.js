const enviarNotificacionMail = require('./mailer');
require('dotenv').config();

(async () => {
  await enviarNotificacionMail({
    to: process.env.ADMIN_EMAIL,
    subject: 'Prueba de notificación automática',
    text: '¡Este es un correo de prueba enviado desde tu backend Node.js!'
  });
  process.exit();
})();
