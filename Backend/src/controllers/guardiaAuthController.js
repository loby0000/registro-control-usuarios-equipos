const Guardia = require('../models/Guardia');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginGuardia = async (req, res) => {
  try {
    const { documento, clave } = req.body;

    if (!documento || !clave) {
      return res.status(400).json({ message: 'Documento y clave son obligatorios' });
    }

    const guardia = await Guardia.findOne({ documento });
    if (!guardia) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validClave = await bcrypt.compare(clave, guardia.clave);
    if (!validClave) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      id: guardia._id,
      documento: guardia.documento,
      rol: 'guardia',
      nombre: guardia.nombre
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
      message: 'Login exitoso',
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en servidor' });
  }
};
