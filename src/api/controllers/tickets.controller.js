import pool from '../../config/db.config.js'; // Importa el pool de conexiones

// Crear un nuevo ticket
export const createTicket = async (id_usuario, descripcion, direccion, prioridad) => {
    console.log('Datos recibidos para crear el ticket:', { id_usuario, descripcion, direccion, prioridad });
  
    if (!id_usuario || !descripcion || !prioridad || !direccion) {
        throw new Error('Todos los campos son obligatorios');
    }
  
    // console.log(prioridad);

    // const validPriorities = ['Baja', 'Media', 'Alta'];
    // if (!validPriorities.includes(prioridad)) {
    //     throw new Error('Prioridad no válida. Debe ser "Baja", "Media" o "Alta".');
    // }

    try {
        const query = `INSERT INTO tickets (id_usuario, descripcion, prioridad, direccion, fecha_creacion) VALUES (?, ?, ?, ?, NOW())`;
        const values = [id_usuario, descripcion, prioridad, direccion];
  
        const [result] = await pool.execute(query, values);
  
        return { id_ticket: result.insertId, id_usuario, descripcion, prioridad, direccion };
    } catch (err) {
        console.error('Error al crear el ticket:', err.message);
        throw new Error('Error al crear el ticket: ' + err.message);
    }
};


// Obtener todos los tickets
export const getAllTickets = async () => {
  const query = `SELECT * FROM tickets`;
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
