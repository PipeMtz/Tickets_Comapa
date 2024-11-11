import express from 'express';
import * as departamentoController from '../controllers/departamentos.controller.js';

const depRouter = express.Router();

// Crear un nuevo departamento
depRouter.post('/', async (req, res) => {
  const { nombre_departamento } = req.body;
  try {
    const newDepartamento = await departamentoController.createDepartamento(nombre_departamento);
    res.status(201).json(newDepartamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los departamentos
depRouter.get('/', async (req, res) => {
  try {
    const departamentos = await departamentoController.getDepartamentos();
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un departamento por ID
depRouter.delete('/:id_departamento', async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const response = await departamentoController.deleteDepartamento(id_departamento);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default depRouter;
