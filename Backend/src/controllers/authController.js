const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controlador de login
exports.loginAdmin = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    // Verificar campos requeridos
    if (!usuario || !clave) {
      return res.status(400).json({ message: 'Usuario y clave son obligatorios' });
    }

    // Buscar admin
    const admin = await Admin.findOne({ usuario });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar claves
    const validClave = await bcrypt.compare(clave, admin.clave);
    if (!validClave) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: admin._id, usuario: admin.usuario, emergencia: admin.emergencia },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en servidor' });
  }
};

