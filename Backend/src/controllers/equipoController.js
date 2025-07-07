const Equipo = require('../models/Equipo');
const Notificacion = require('../models/Notificacion');

exports.crearEquipo = async (req, res) => {
  try {
    const { nombre, serial } = req.body;
    const nuevoEquipo = new Equipo({ nombre, serial });
    await nuevoEquipo.save();

    // Ejemplo: Crear notificación manual
    await Notificacion.create({
      titulo: 'Nuevo equipo registrado',
      mensaje: `Se ha registrado el equipo ${nombre} (serial: ${serial})`,
      tipo: 'info',
      fecha: new Date(),
      leida: false
    });

    res.status(201).json({ message: 'Equipo creado y notificación enviada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear equipo' });
  }
};
