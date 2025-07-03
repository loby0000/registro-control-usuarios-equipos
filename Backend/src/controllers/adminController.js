const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Crear nuevo admin (elimina anterior, excepto emergencia)
exports.createAdmin = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
      return res.status(400).json({ message: 'Usuario y clave son obligatorios' });
    }

    // Eliminar admins no emergencia
    await Admin.deleteMany({ emergencia: false });

    const hash = await bcrypt.hash(clave, 10);

    const nuevoAdmin = new Admin({
      usuario,
      clave: hash,
      emergencia: false
    });

    await nuevoAdmin.save();

    res.status(201).json({ message: 'Nuevo admin creado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear admin' });
  }
};
