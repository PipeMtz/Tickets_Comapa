import mysql from 'mysql2/promise';
import dotenv from 'dotenv'; 

dotenv.config();

export const secretKey = process.env.SECRET_KEY;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT

});

// Verificar la conexión a la base de datos
const testConnection = async () => {
  try {
    console.log(secretKey)
    const connection = await pool.getConnection(); // Obtener una conexión del pool
    console.log('Conexión a la base de datos establecida exitosamente.');
    connection.release(); // Libera la conexión de vuelta al pool
  } catch (err) {
    console.error('No se pudo conectar a la base de datos:', err);
  }
};


//testConnection(); // Llama a la función para probar la conexión

export default pool; // Exporta el pool para usarlo en otras partes de la aplicación
