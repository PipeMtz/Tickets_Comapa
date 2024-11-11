import pool from '../../config/db.config.js';

// Crear un nuevo departamento
export const createDepartamento = async (nombre_departamento) => {
  const query = `INSERT INTO departamentos (nombre_departamento) VALUES (?)`;
  try {
    const [result] = await pool.execute(query, [nombre_departamento]);
    return { id_departamento: result.insertId, nombre_departamento };
  } catch (err) {
    throw new Error('Error al crear el departamento: ' + err.message);
  }
};

// Obtener todos los departamentos
export const getDepartamentos = async () => {
  const query = `SELECT * FROM departamentos`;
  try {
    const [rows] = await pool.execute(query);
    return rows;
  } catch (err) {
    throw new Error('Error al obtener los departamentos: ' + err.message);
  }
};

// Eliminar un departamento por ID
export const deleteDepartamento = async (id_departamento) => {
  const query = `DELETE FROM departamentos WHERE id_departamento = ?`;
  try {
    await pool.execute(query, [id_departamento]);
    return { message: 'Departamento eliminado exitosamente.' };
  } catch (err) {
    throw new Error('Error al eliminar el departamento: ' + err.message);
  }
};
