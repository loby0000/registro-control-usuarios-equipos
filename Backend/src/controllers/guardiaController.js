const Guardia = require('../models/Guardia');
const bcrypt = require('bcrypt');

exports.createGuardia = async (req, res) => {
  try {
    const { documento, nombre, jornada, clave } = req.body;

    if (!documento || !nombre || !jornada || !clave) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar jornada válida
    if (!['mañana', 'tarde', 'noche'].includes(jornada)) {
      return res.status(400).json({ message: 'Jornada inválida' });
    }

    // Verificar documento único
    const guardiaExistente = await Guardia.findOne({ documento });
    if (guardiaExistente) {
      return res.status(400).json({ message: 'El documento ya existe' });
    }

    const hash = await bcrypt.hash(clave, 10);

    const nuevoGuardia = new Guardia({
      documento,
      nombre,
      jornada,
      clave: hash
    });

    await nuevoGuardia.save();

    res.status(201).json({ message: 'Guardia registrado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar guardia' });
  }
};
