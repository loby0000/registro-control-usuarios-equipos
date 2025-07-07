const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const admin = await Admin.findOne({ usuario });
    if (!admin) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    const validClave = await bcrypt.compare(clave, admin.clave);
    if (!validClave) {
      return res.status(401).json({ message: 'Clave incorrecta' });
    }


    // Si es usuario de emergencia, fuerza rol: 'admin'
    const payload = {
      id: admin._id,
      usuario: admin.usuario,
      rol: (admin.emergencia === true) ? 'admin' : (admin.rol || 'admin'),
      emergencia: admin.emergencia || false
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión admin' });
  }
};
