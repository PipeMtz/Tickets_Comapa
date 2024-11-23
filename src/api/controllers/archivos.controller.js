import pool from '../../config/db.config.js';  // Importar el pool de conexiones

// Función para subir un archivo
export const subirArchivo = async (req, res) => {
  const { id_ticket, nombre, tipo, base64 } = req.body;

  // Validar si se recibieron los datos correctos
  if (!id_ticket || !nombre || !tipo || !base64) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    // Insertar archivo en la base de datos utilizando el pool
    const [result] = await pool.execute(
      'INSERT INTO archivos (id_ticket, nombre, tipo, base64) VALUES (?, ?, ?, ?)',
      [id_ticket, nombre, tipo, base64]
    );
    
    res.status(200).json({ message: 'Archivo subido con éxito', archivoId: result.insertId });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    res.status(500).json({ message: 'Error al subir el archivo' });
  }
};

// Función para obtener los archivos por ticket
export const obtenerArchivosPorTicket = async (req, res) => {
  const { id_ticket } = req.params;

  try {
    // Obtener los archivos del ticket utilizando el pool
    const [archivos] = await pool.execute('SELECT * FROM archivos WHERE id_ticket = ?', [id_ticket]);
    res.status(200).json(archivos);
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    res.status(500).json({ message: 'Error al obtener los archivos' });
  }
};

// Función para eliminar un archivo
export const eliminarArchivo = async (req, res) => {
  const { id_archivo } = req.params;

  try {
    // Eliminar archivo de la base de datos utilizando el pool
    const [result] = await pool.execute('DELETE FROM archivos WHERE id_archivo = ?', [id_archivo]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    res.status(200).json({ message: 'Archivo eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({ message: 'Error al eliminar el archivo' });
  }
};
