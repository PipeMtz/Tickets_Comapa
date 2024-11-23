import pool from '../../config/db.config.js'; // Importa el pool de conexiones

// Función para crear un nuevo usuario
export const createUser = async (nombre, email, contrasena, role) => {
  const query = `INSERT INTO usuarios (nombre, email, contrasena, fecha_registro) VALUES (?, ?, ?, NOW())`;
  const values = [nombre, email, contrasena];

  try {
    const [result] = await pool.execute(query, values);

    // Asegúrate de que el rol existe
    const [roleData] = await pool.execute('SELECT * FROM roles WHERE nombre_rol = ?', [role]);
    if (!roleData.length) {
      throw new Error('El rol especificado no existe');
    }

    // Asignar el rol al usuario recién creado
    await pool.execute('INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (?, ?)', [result.insertId, roleData[0].id_rol]);

    // Retornar usuario y rol asignado
    return { id_usuario: result.insertId, nombre, email, contrasena, role: roleData[0].nombre_rol };
  } catch (err) {
    throw new Error('Error al crear el usuario: ' + err.message);
  }
};



// Función para obtener un usuario por ID
export const getUserById = async (id_usuario) => {
  const query = `SELECT * FROM usuarios WHERE id_usuario = ?`;
  try {
    const [rows] = await pool.execute(query, [id_usuario]);
    return rows[0]; // Devuelve el primer usuario encontrado
  } catch (err) {
    throw new Error('Error al obtener el usuario: ' + err.message);
  }
};

export const getAllUsers = async () => {
  const query = `SELECT * FROM usuarios`;
  try {
    const [rows] = await pool.execute(query);
    return rows; // Devuelve todos los usuarios encontrados
  } catch (err) {
    throw new Error('Error al obtener los usuarios: ' + err.message); // Actualiza el mensaje de error
  }
};


// Función para obtener un usuario por email
export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM usuarios WHERE email = ?`;
  try {
    const [rows] = await pool.execute(query, [email]);
    return rows[0]; // Devuelve el primer usuario encontrado
  } catch (err) {
    throw new Error('Error al obtener el usuario: ' + err.message);
  }
};

// Función para actualizar un usuario
export const updateUser = async (id_usuario, nombre, email, contrasena) => {
  const query = `UPDATE usuarios SET nombre = ?, email = ?, contrasena = ? WHERE id_usuario = ?`;
  const values = [nombre, email, contrasena, id_usuario];

  try {
    await pool.execute(query, values);
    return { id_usuario, nombre, email, contrasena }; // Devuelve el usuario actualizado
  } catch (err) {
    throw new Error('Error al actualizar el usuario: ' + err.message);
  }
};

// Función para eliminar un usuario
export const deleteUser = async (id_usuario) => {
  const query = `DELETE FROM usuarios WHERE id_usuario = ?`;

  try {
    await pool.execute(query, [id_usuario]);
    return { message: 'Usuario eliminado exitosamente.' }; // Mensaje de éxito
  } catch (err) {
    throw new Error('Error al eliminar el usuario: ' + err.message);
  }
};

// Función para obtener todos los usuarios con sus roles y departamentos
export const getAllUsersWithDetails = async () => {
  const query = `
    SELECT 
      u.id_usuario,
      u.nombre AS nombre_usuario,
      u.email,
      u.telefono,
      d.nombre_departamento,
      GROUP_CONCAT(r.nombre_rol SEPARATOR ', ') AS roles,
      u.fecha_registro
    FROM usuarios u
    LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
    LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    GROUP BY u.id_usuario
  `;
  try {
    const [rows] = await pool.execute(query);
    return rows; // Devuelve los usuarios con sus detalles
  } catch (err) {
    throw new Error('Error al obtener los usuarios con detalles: ' + err.message);
  }
};

// Función para actualizar el departamento y rol de un usuario
export const updateUserAdmin = async (id_usuario, nuevoDepartamento, nuevoRol) => {
  const query = `
    UPDATE usuarios
    SET id_departamento = (SELECT id_departamento FROM departamentos WHERE nombre_departamento = ?),
        id_rol = (SELECT id_rol FROM roles WHERE nombre_rol = ?)
    WHERE id_usuario = ?
  `;
  const values = [nuevoDepartamento, nuevoRol, id_usuario];

  try {
    const [result] = await pool.execute(query, values);
    if (result.affectedRows === 0) {
      throw new Error('No se encontró el usuario o los datos proporcionados son inválidos');
    }
    return { id_usuario, nuevoDepartamento, nuevoRol };
  } catch (err) {
    throw new Error('Error al actualizar el usuario: ' + err.message);
  }
};
