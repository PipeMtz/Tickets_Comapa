import pool from '../../config/db.config.js';

// Asignar un ticket a un empleado
export const assignTicket = async (id_ticket, id_usuario_creador, id_usuario_asignado) => {
  const query = `INSERT INTO ticket_asignaciones (id_ticket, id_usuario_creador, id_usuario_asignado, fecha_asignacion) 
                 VALUES (?, ?, ?, NOW())`;
  
  try {
    await pool.execute(query, [id_ticket, id_usuario_creador, id_usuario_asignado]);
    return { id_ticket, id_usuario_creador, id_usuario_asignado, message: 'Ticket asignado con éxito' };
  } catch (err) {
    throw new Error('Error al asignar el ticket: ' + err.message);
  }
};

// Obtener asignaciones por ticket
export const getAsignacionesByTicket = async (id_ticket) => {
  const query = `SELECT u.nombre AS nombre_asignado, ta.*, t.titulo AS titulo_ticket
                 FROM ticket_asignaciones ta
                 LEFT JOIN usuarios u ON ta.id_usuario_asignado = u.id_usuario
                 LEFT JOIN tickets t ON ta.id_ticket = t.id_ticket
                 WHERE ta.id_ticket = ?;`;

  try {
    const [rows] = await pool.execute(query, [id_ticket]);
    return rows;
  } catch (err) {
    throw new Error('Error al obtener asignaciones: ' + err.message);
  }
};

// Actualizar asignación de ticket
export const updateTicketAsignacion = async (id_ticket, id_usuario_asignado, { id_usuario_creador }) => {
  const query = `UPDATE ticket_asignaciones 
                 SET id_usuario_creador = ?, id_usuario_asignado = ?, fecha_asignacion = NOW() 
                 WHERE id_ticket = ? AND id_usuario_asignado = ?`;

  try {
    const [result] = await pool.execute(query, [id_usuario_creador, id_usuario_asignado, id_ticket, id_usuario_asignado]);

    if (result.affectedRows === 0) {
      throw new Error('No se encontró la asignación para actualizar');
    }

    return { message: 'Asignación de ticket actualizada con éxito' };
  } catch (err) {
    throw new Error('Error al actualizar la asignación de ticket: ' + err.message);
  }
};
