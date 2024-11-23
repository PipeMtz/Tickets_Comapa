import pool from '../../config/db.config.js'; // Importa el pool de conexiones
import ExcelJS from 'exceljs';

// Controlador para crear el ticket
export const createTicket = async (id_usuario, descripcion, direccion, asunto) => {
  console.log('Datos recibidos para crear el ticket:', { id_usuario, descripcion, direccion, asunto });

  if (!id_usuario || !descripcion || !direccion || !asunto) {
    throw new Error('Todos los campos son obligatorios');
  }

  try {
    const query = `
      INSERT INTO tickets (id_usuario, descripcion, prioridad, direccion, id_tipo, fecha_creacion) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const values = [id_usuario, descripcion, 'Media', direccion, asunto]; // 'asunto' debe ser el id_tipo

    const [result] = await pool.execute(query, values);

    // Devolver el id_ticket del nuevo ticket creado
    return { id_ticket: result.insertId };
  } catch (err) {
    console.error('Error al crear el ticket:', err.message);
    throw new Error('Error al crear el ticket');
  }
};




// Obtener todos los tickets
export const getAllTickets = async () => {
  const query = `SELECT 
                    t.id_ticket,
                    u.nombre,
                    t.descripcion,
                    t.direccion,
                    t.prioridad,
                    t.estado,
                    d.nombre_departamento,
                    t.fecha_creacion,
                    ti.nombre AS tipo
                FROM tickets t
                LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
                LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
                LEFT JOIN tipos ti ON t.id_tipo = ti.id_tipo;`;
  try {
    const [rows] = await pool.execute(query);
    return rows; 
  } catch (err) {
    throw new Error('Error al obtener los tickets: ' + err.message);
  }
};

// Obtener un ticket por ID
export const getTicketById = async (id_ticket) => {
  const query = `SELECT * FROM tickets WHERE id_ticket = ?`;
  try {
    const [rows] = await pool.execute(query, [id_ticket]);
    return rows[0]; // Devuelve el ticket encontrado
  } catch (err) {
    throw new Error('Error al obtener el ticket: ' + err.message);
  }
};

// Actualizar un ticket
export const updateTicket = async (id_ticket, descripcion, estado) => {
  const query = `UPDATE tickets SET descripcion = ?, estado = ? WHERE id_ticket = ?`;
  const values = [descripcion, estado, id_ticket];

  try {
    await pool.execute(query, values);
    return { id_ticket, descripcion, estado }; // Devuelve el ticket actualizado
  } catch (err) {
    throw new Error('Error al actualizar el ticket: ' + err.message);
  }
};

// Eliminar un ticket
export const deleteTicket = async (id_ticket) => {
  const query = `DELETE FROM tickets WHERE id_ticket = ?`;

  try {
    await pool.execute(query, [id_ticket]);
    return { message: 'Ticket eliminado exitosamente.' }; // Mensaje de éxito
  } catch (err) {
    throw new Error('Error al eliminar el ticket: ' + err.message);
  }
};

// Función para exportar tickets a Excel con filtros
export const exportTicketsToExcel = async (filters, res) => {
  // Filtros del frontend (pueden ser vacíos o tener un valor)
  const {
    departamento = 'Todo',
    tipoProblema = 'Todo',
    fechaInicio = '',
    fechaFin = '',
    prioridad = 'Todo',
    estado = 'Todo'
  } = filters;

  // Iniciar la construcción del query
  let query = `
    SELECT t.id_ticket, u.nombre AS usuario, t.descripcion, t.direccion, t.prioridad, t.estado, 
           d.nombre_departamento, t.fecha_creacion
    FROM tickets t
    LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
    LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
    WHERE 1=1`; 

  // Agregar filtros dinámicamente
  if (departamento !== 'Todo') {
    query += ` AND d.nombre_departamento = ?`;
  }
  if (tipoProblema !== 'Todo') {
    query += ` AND t.tipo = ?`; // Suponiendo que 'tipo' es la columna para el tipo de problema
  }
  if (fechaInicio) {
    query += ` AND t.fecha_creacion >= ?`;
  }
  if (fechaFin) {
    query += ` AND t.fecha_creacion <= ?`;
  }
  if (prioridad !== 'Todo') {
    query += ` AND t.prioridad = ?`;
  }
  if (estado !== 'Todo') {
    query += ` AND t.estado = ?`;
  }

  try {
    // Preparar los valores para los filtros
    const values = [];
    if (departamento !== 'Todo') values.push(departamento);
    if (tipoProblema !== 'Todo') values.push(tipoProblema);
    if (fechaInicio) values.push(fechaInicio);
    if (fechaFin) values.push(fechaFin);
    if (prioridad !== 'Todo') values.push(prioridad);
    if (estado !== 'Todo') values.push(estado);

    // Ejecutar el query con los valores de filtro
    const [rows] = await pool.execute(query, values);

    // Crear el archivo Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tickets');

    // Definir las columnas para el Excel
    worksheet.columns = [
      { header: 'ID Ticket', key: 'id_ticket' },
      { header: 'Usuario', key: 'usuario' },
      { header: 'Descripción', key: 'descripcion' },
      { header: 'Dirección', key: 'direccion' },
      { header: 'Prioridad', key: 'prioridad' },
      { header: 'Estado', key: 'estado' },
      { header: 'Departamento', key: 'nombre_departamento' },
      { header: 'Fecha Creación', key: 'fecha_creacion' },
    ];

    // Agregar las filas al Excel
    rows.forEach((row) => worksheet.addRow(row));

    // Configurar los encabezados para la descarga del archivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tickets.xlsx');

    // Escribir el archivo y devolverlo al cliente
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Error generando el archivo Excel:', error);
    res.status(500).json({ error: 'Error generando el archivo Excel' });
  }
};