import pool from '../../config/db.config.js';

// Crear un nuevo rol
export const createRole = async (nombre_rol) => {
  const query = `INSERT INTO roles (nombre_rol) VALUES (?)`;
  try {
    const [result] = await pool.execute(query, [nombre_rol]);
    return { id_rol: result.insertId, nombre_rol };
  } catch (err) {
    throw new Error('Error al crear el rol: ' + err.message);
  }
};

// Obtener todos los roles
export const getRoles = async () => {
  const query = `SELECT * FROM roles`;
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (err) {
    throw new Error('Error al obtener los roles: ' + err.message);
  }
};

// Eliminar un rol por ID
export const deleteRole = async (id_rol) => {
  const query = `DELETE FROM roles WHERE id_rol = ?`;
  try {
    await pool.execute(query, [id_rol]);
    return { message: 'Rol eliminado exitosamente.' };
  } catch (err) {
    throw new Error('Error al eliminar el rol: ' + err.message);
  }
};
