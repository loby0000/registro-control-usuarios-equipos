const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function enviarNotificacionMail({ to, subject, text }) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text
    });
    console.log('📧 Notificación enviada por correo a', to);
  } catch (err) {
    console.error('Error enviando correo:', err.message);
  }
}

module.exports = enviarNotificacionMail;
