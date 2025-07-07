const Registro = require('../models/Registro');
const ExcelJS = require('exceljs');

exports.exportarHistorialExcel = async (req, res) => {
  try {
    // 👉 1. Filtros opcionales por query
    const { usuario, fechaInicio, fechaFin } = req.query;

    let filtro = {};
    if (usuario) {
      filtro['usuario.numero_documento'] = usuario;
    }
    if (fechaInicio || fechaFin) {
      filtro.fecha = {};
      if (fechaInicio) filtro.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filtro.fecha.$lte = new Date(fechaFin);
    }

    // 👉 2. Consulta con relaciones
    const registros = await Registro.find(filtro)
      .populate('usuario')
      .populate('equipos')
      .populate('guardia_responsable');

    // 👉 3. Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historial');

    // 👉 4. Cabeceras de columnas
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 25 },
      { header: 'Tipo Registro', key: 'tipo_registro', width: 20 },
      { header: 'Usuario', key: 'usuario', width: 30 },
      { header: 'Documento', key: 'documento', width: 20 },
      { header: 'Tipo Usuario', key: 'tipo_usuario', width: 20 },
      { header: 'Equipos', key: 'equipos', width: 50 },
      { header: 'Guardia Responsable', key: 'guardia', width: 30 }
    ];

    // 👉 5. Agregar filas, validando datos nulos
    registros.forEach(registro => {
      const equipos = registro.equipos && registro.equipos.length
        ? registro.equipos.map(eq => `${eq.nombre} (${eq.serial})`).join(', ')
        : 'N/A';

      worksheet.addRow({
        fecha: registro.fecha.toISOString().slice(0, 19).replace('T', ' '),
        tipo_registro: registro.tipo_registro,
        usuario: registro.usuario?.nombre_completo || 'N/A',
        documento: registro.usuario?.numero_documento || 'N/A',
        tipo_usuario: registro.usuario?.tipo_usuario || 'N/A',
        equipos: equipos,
        guardia: registro.guardia_responsable
          ? `${registro.guardia_responsable.nombre} (${registro.guardia_responsable.documento})`
          : 'No disponible'
      });
    });

    // 👉 6. Headers de respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    const fecha = new Date().toISOString()
      .slice(0, 19)
      .replace(/:/g, '-')
      .replace('T', '_');

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="registro_${fecha}.xlsx"`
    );

    // 👉 7. Generar archivo y enviar
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al exportar historial' });
  }
};
