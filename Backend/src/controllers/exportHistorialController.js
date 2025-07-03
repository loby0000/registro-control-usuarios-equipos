const ExcelJS = require('exceljs');
const Registro = require('../models/Registro');
const Usuario = require('../models/Usuario');
const Equipo = require('../models/Equipo');

exports.exportarHistorialExcel = async (req, res) => {
  try {
    const { usuario, serial, fechaInicio, fechaFin } = req.query;

    const filtros = {};

    if (usuario) {
      const user = await Usuario.findOne({ numero_documento: usuario });
      if (user) {
        filtros.usuario = user._id;
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }

    if (serial) {
      const equipo = await Equipo.findOne({ serial });
      if (equipo) {
        filtros.equipos = equipo._id;
      } else {
        return res.status(404).json({ message: 'Equipo no encontrado' });
      }
    }

    if (fechaInicio && fechaFin) {
      filtros.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin)
      };
    }

    const registros = await Registro.find(filtros)
      .populate('usuario', 'nombre_completo numero_documento tipo_usuario')
      .populate('equipos', 'nombre serial')
      .populate('guardia_responsable', 'nombre documento jornada')
      .sort({ fecha: -1 });

    // Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historial');

    // Encabezados
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Tipo Registro', key: 'tipo_registro', width: 15 },
      { header: 'Usuario', key: 'usuario', width: 25 },
      { header: 'Documento', key: 'documento', width: 15 },
      { header: 'Tipo Usuario', key: 'tipo_usuario', width: 15 },
      { header: 'Equipos', key: 'equipos', width: 40 },
      { header: 'Guardia Responsable', key: 'guardia', width: 25 }
    ];

    // Llenar datos
    registros.forEach(registro => {
      const equipos = registro.equipos.map(eq => `${eq.nombre} (${eq.serial})`).join(', ');
      worksheet.addRow({
        fecha: registro.fecha.toISOString().slice(0, 19).replace('T', ' '),
        tipo_registro: registro.tipo_registro,
        usuario: registro.usuario.nombre_completo,
        documento: registro.usuario.numero_documento,
        tipo_usuario: registro.usuario.tipo_usuario,
        equipos: equipos,
        guardia: `${registro.guardia_responsable.nombre} (${registro.guardia_responsable.documento})`
      });
    });

    // Configurar headers de respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=historial.xlsx'
    );

    // Enviar archivo
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al exportar historial' });
  }
};
