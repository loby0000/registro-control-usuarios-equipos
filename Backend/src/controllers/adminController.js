const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🚀 Login del Admin EXISTENTE (ruta: /api/auth/login)
exports.loginAdmin = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const admin = await Admin.findOne({ usuario });
    if (!admin) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(clave, admin.clave);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 🗝️ Crear payload con rol
    const payload = {
      id: admin._id,
      usuario: admin.usuario,
      rol: admin.rol || 'admin',
      nombre: admin.nombre || admin.usuario || null
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en login admin' });
  }
};

// ✅ Crear NUEVO Admin (ruta: /api/admin/login)
exports.createAdmin = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    // 👀 Verifica si ya existe otro admin
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin && existingAdmin.usuario !== 'testAdmin123') {
      // ⚠️ Si NO es el de emergencia, se elimina
      await Admin.deleteOne({ _id: existingAdmin._id });
    }

    // 🔒 Cifra la clave
    const hashedPassword = await bcrypt.hash(clave, 10);

    // 👤 Crea nuevo admin
    const newAdmin = new Admin({
      usuario,
      clave: hashedPassword,
      fecha_creacion: new Date()
    });

    await newAdmin.save();

    res.json({ message: 'Nuevo admin creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear nuevo admin' });
  }
};
