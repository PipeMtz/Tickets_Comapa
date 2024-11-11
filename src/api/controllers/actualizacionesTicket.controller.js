import pool from '../../config/db.config.js';

// Crear una nueva actualización
export const createActualizacion = async (id_ticket, id_usuario, comentario) => {
  const query = `INSERT INTO actualizaciones_ticket (id_ticket, id_usuario, comentario, fecha_actualizacion) VALUES (?, ?, ?, NOW())`;
  try {
    const [result] = await pool.execute(query, [id_ticket, id_usuario, comentario]);
    return { id_actualizacion: result.insertId, id_ticket, id_usuario, comentario };
  } catch (err) {
    throw new Error('Error al crear la actualización: ' + err.message);
  }
};

// Obtener actualizaciones de un ticket
export const getActualizacionesByTicket = async (id_ticket) => {
  const query = `SELECT * FROM actualizaciones_ticket WHERE id_ticket = ? ORDER BY fecha_actualizacion DESC`;
  try {
    const [rows] = await pool.execute(query, [id_ticket]);
    return rows;
  } catch (err) {
    throw new Error('Error al obtener actualizaciones: ' + err.message);
  }
};
