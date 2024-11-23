import express from 'express';
import { subirArchivo, obtenerArchivosPorTicket, eliminarArchivo } from '../controllers/archivos.controller.js';

const fileRouter = express.Router();

// Ruta para subir un archivo
fileRouter.post('/subir', subirArchivo);

// Ruta para obtener archivos por ticket
fileRouter.get('/ticket/:id_ticket', obtenerArchivosPorTicket);

// Ruta para eliminar un archivo
fileRouter.delete('/:id_archivo', eliminarArchivo);

export default fileRouter;
