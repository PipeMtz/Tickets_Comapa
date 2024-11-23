import pool from '../../config/db.config.js';

export const getTipos = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipos');
    return rows; // Devolver los datos en lugar de usar `res`
  } catch (error) {
    console.error('Error al obtener los tipos:', error);
    throw new Error('Error al obtener los tipos'); // Lanza el error para que la ruta lo maneje
  }
};
