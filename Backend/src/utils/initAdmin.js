require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB');

    const existeAdmin = await Admin.findOne({ emergencia: true });

    if (!existeAdmin) {
      const hash = await bcrypt.hash('Admin123', 10);
      await Admin.create({
        usuario: 'testAdmin123',
        clave: hash,
        emergencia: true,
        rol: 'admin'
      });
      console.log('✅ Admin de emergencia creado');
    } else {
      console.log('⚠️ Ya existe admin de emergencia');
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
