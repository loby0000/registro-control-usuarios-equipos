const Usuario = require('../models/Usuario');
const Equipo = require('../models/Equipo');
const Registro = require('../models/Registro');

exports.registrarUsuario = async (req, res) => {
  try {
    const {
      tipo_registro,
      tipo_usuario,
      nombre_completo,
      tipo_documento,
      numero_documento,
      equipos
    } = req.body;

    // El guardia autenticado viene del JWT
    const guardiaId = req.user.id;

    let usuario = await Usuario.findOne({ numero_documento });

    if (tipo_registro === 'Primera vez') {
      if (usuario) {
        return res.status(400).json({ message: 'Usuario ya existe, use "Ya registrado"' });
      }

      usuario = new Usuario({
        tipo_usuario,
        nombre_completo,
        tipo_documento,
        numero_documento
      });

      // Crear equipos
      const equiposGuardados = [];
      for (const eq of equipos) {
        const nuevoEquipo = new Equipo({
          nombre: eq.nombre,
          serial: eq.serial,
          lleva_cargador: eq.lleva_cargador,
          lleva_mouse: eq.lleva_mouse,
          otras_caracteristicas: eq.otras_caracteristicas,
          usuario: usuario._id
        });
        await nuevoEquipo.save();
        equiposGuardados.push(nuevoEquipo._id);
      }

      usuario.equipos = equiposGuardados;
      await usuario.save();

      const nuevoRegistro = new Registro({
        usuario: usuario._id,
        equipos: equiposGuardados,
        tipo_registro: 'entrada',
        guardia_responsable: guardiaId
      });
      await nuevoRegistro.save();

      return res.status(201).json({ message: 'Usuario y equipos registrados (entrada)' });

    } else if (tipo_registro === 'Ya registrado') {
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Alternar: verificar último registro
      const ultimoRegistro = await Registro.findOne({ usuario: usuario._id })
        .sort({ fecha: -1 });

      const nuevoTipo = !ultimoRegistro || ultimoRegistro.tipo_registro === 'salida'
        ? 'entrada'
        : 'salida';

      const nuevoRegistro = new Registro({
        usuario: usuario._id,
        equipos: usuario.equipos,
        tipo_registro: nuevoTipo,
        guardia_responsable: guardiaId
      });

      await nuevoRegistro.save();

      return res.status(200).json({ message: `Registro ${nuevoTipo} guardado` });

    } else {
      return res.status(400).json({ message: 'Tipo de registro inválido' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en registro de usuario' });
  }
};
