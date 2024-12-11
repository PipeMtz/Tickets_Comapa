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
    ua.nombre as nombre_asignado,
    t.prioridad,
    t.estado,
    da.nombre_departamento,
    t.fecha_creacion,
    ti.nombre AS tipo
FROM tickets t
LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
left join usuarios ua on t.id_usuario_asignado = ua.id_usuario
LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
Left join departamentos da on ua.id_departamento = da.id_departamento
LEFT JOIN tipos ti ON t.id_tipo = ti.id_tipo
order by fecha_creacion desc;`;
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

// Obtener tickets por usuario
export const getTicketsByUser = async (user) => {
  console.log(user);
  const query = `
                SELECT 
                  t.id_ticket,
                  u.nombre,
                  t.descripcion,
                  t.direccion,
                  t.estado,
                  t.fecha_creacion,
                  ti.nombre AS tipo
              FROM tickets t
              LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
              left join usuarios ua on t.id_usuario_asignado = ua.id_usuario
              LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
              Left join departamentos da on ua.id_departamento = da.id_departamento
              LEFT JOIN tipos ti ON t.id_tipo = ti.id_tipo
              where t.id_usuario = ?
              order by fecha_creacion desc;
  `;
  try {
    const [rows] = await pool.execute(query, [user]);
    return rows; // Devuelve los tickets encontrados
  } catch (err) {
    throw new Error('Error al obtener los tickets: ' + err.message);
  }
};

// Actualizar un ticket
export const updateTicket = async (id_ticket, prioridad, estado, id_usuario_asignado) => {
  const query = `
    UPDATE tickets
    SET prioridad = ?, estado = ?, id_usuario_asignado = ?
    WHERE id_ticket = ?
  `;
  const values = [prioridad, estado, id_usuario_asignado, id_ticket];

  try {
    await pool.execute(query, values);
    return { id_ticket, prioridad, estado, id_usuario_asignado }; // Devuelve los datos actualizados
  } catch (err) {
    throw new Error('Error al actualizar el ticket: ' + err.message);
  }
};

// Obtener attachments por ticket id
export const getAttachmentsByTicketId = async (id_ticket) => {
  const query = `SELECT * FROM archivos WHERE id_ticket = ?`;
  try {
    const [rows] = await pool.execute(query, [id_ticket]);
    console.log('Attachments obtenidos:', rows);
    return rows;
  } catch (err) {
    throw new Error('Error al obtener los attachments: ' + err.message);
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

export const exportTicketsToExcel = async (req, res) => {
  console.log('Body recibido:', req.body); // Depuración
  try {
    const tickets = req.body;

    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron tickets válidos.' });
    }

    console.log('Tickets procesados:', tickets);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tickets');

    worksheet.columns = [
      { header: 'ID Ticket', key: 'id_ticket' },
      { header: 'Usuario', key: 'nombre' },
      { header: 'Descripción', key: 'descripcion' },
      { header: 'Dirección', key: 'direccion' },
      { header: 'Prioridad', key: 'prioridad' },
      { header: 'Estado', key: 'estado' },
      { header: 'Departamento', key: 'nombre_departamento' },
      { header: 'Asignado a', key: 'nombre_asignado' },  // Aquí agregamos la columna "Asignado a"
      { header: 'Fecha Creación', key: 'fecha_creacion' },
    ];

    tickets.forEach((ticket) => worksheet.addRow(ticket));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=tickets.xlsx');

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error('Error generando el archivo Excel:', error);
    res.status(500).json({ error: 'Error generando el archivo Excel' });
  }
};




export const getFilteredTickets = async (filters) => {
  const {
    departamento = 'Todo',
    tipoProblema = 'Todo',
    fechaInicio = '',
    fechaFin = '',
    prioridad = 'Todo',
    estado = 'Todo'
  } = filters;

  // Base de la consulta
  let query = `
    SELECT 
        t.id_ticket,
        u.nombre AS nombre,
        t.descripcion,
        t.direccion,
        ua.nombre AS nombre_asignado,
        t.prioridad,
        t.estado,
        da.nombre_departamento,
        t.fecha_creacion,
        ti.nombre AS tipo
    FROM tickets t
    LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
    LEFT JOIN usuarios ua ON t.id_usuario_asignado = ua.id_usuario
    LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
    LEFT JOIN departamentos da ON ua.id_departamento = da.id_departamento
    LEFT JOIN tipos ti ON t.id_tipo = ti.id_tipo
    WHERE 1=1
  `;

  const values = [];

  // Agregar filtros dinámicos
  if (departamento !== 'Todo') {
    query += ' AND da.nombre_departamento = ?';
    values.push(departamento);
  }
  if (tipoProblema !== 'Todo') {
    query += ' AND ti.nombre = ?';
    values.push(tipoProblema);
  }
  if (fechaInicio && fechaFin) {
    query += ' AND t.fecha_creacion BETWEEN ? AND ?';
    values.push(fechaInicio, fechaFin);
  }
  if (prioridad !== 'Todo') {
    query += ' AND t.prioridad = ?';
    values.push(prioridad);
  }
  if (estado !== 'Todo') {
    query += ' AND t.estado = ?';
    values.push(estado);
  }

  // Ejecutar la consulta
  const [rows] = await pool.execute(query, values);
  return rows;
};
