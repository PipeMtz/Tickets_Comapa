import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import picocolors from 'picocolors';
import pool from './src/config/db.config.js'; // Importa el pool de conexiones
import authRouter from './src/api/routes/auth.routes.js';
import usersRouter from './src/api/routes/users.routes.js';
import ticketsRouter from './src/api/routes/tickets.routes.js';
import { verifyToken } from './src/middleware/verifyToken.js';
import departamentosRouter from './src/api/routes/departamentos.routes.js';
import ticketAsignacionesRouter from './src/api/routes/ticketAsignaciones.routes.js';
import actualizacionesTicketRouter from './src/api/routes/actualizacionesTicket.routes.js';

// import ticketsRouter from './src/api/routes/tickets.routes.js';

dotenv.config();
const pc = picocolors;
const PORT = process.env.PORT || 3000;
const app = express();

// Verificar conexión a la base de datos
const testConnection = async () => {
  try {
    const connection = await pool.getConnection(); // Obtener una conexión del pool
    console.log(pc.green('Conexión a la base de datos establecida correctamente.'));
    connection.release(); // Libera la conexión de vuelta al pool
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Salir del proceso si no se puede conectar
  }
};

testConnection(); // Llama a la función para probar la conexión

// Middlewares
app
  .disable('x-powered-by')
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRouter);
// app.use(verifyToken);
app.use('/api/users', usersRouter, verifyToken);
app.use('/api/tickets', ticketsRouter, verifyToken);

app.use('/api/departamentos', departamentosRouter, verifyToken);
app.use('/api/asignaciones', ticketAsignacionesRouter,verifyToken);
app.use('/api/actualizaciones', actualizacionesTicketRouter, verifyToken);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(pc.green(`Servidor en ejecución en el puerto ${PORT}`));
});
