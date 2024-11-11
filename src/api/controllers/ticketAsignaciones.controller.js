import pool from '../../config/db.config.js';

// Asignar un ticket a un empleado
export const assignTicket = async (id_ticket, id_usuario) => {
  const query = `INSERT INTO ticket_asignaciones (id_ticket, id_usuario, fecha_asignacion) VALUES (?, ?, NOW())`;
  try {
    await pool.execute(query, [id_ticket, id_usuario]);
    return { id_ticket, id_usuario, message: 'Ticket asignado con éxito' };
  } catch (err) {
    throw new Error('Error al asignar el ticket: ' + err.message);
  }
};

// Obtener asignaciones por ticket
export const getAsignacionesByTicket = async (id_ticket) => {
  const query = `SELECT u.nombre, ta.*
                FROM ticket_asignaciones ta
                LEFT JOIN usuarios u ON ta.id_usuario = u.id_usuario
                WHERE ta.id_ticket = ?;`;
  try {
    const [rows] = await pool.execute(query, [id_ticket]);
    return rows;
  } catch (err) {
    throw new Error('Error al obtener asignaciones: ' + err.message);
  }
};
