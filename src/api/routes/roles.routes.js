import express from 'express';
import * as rolesController from '../controllers/roles.controller.js';

const rolesRouter = express.Router();

// Crear un nuevo rol
rolesRouter.post('/', async (req, res) => {
  const { nombre_rol } = req.body;
  try {
    const newRole = await rolesController.createRole(nombre_rol);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los roles
rolesRouter.get('/', async (req, res) => {
  try {
    const roles = await rolesController.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un rol por ID
rolesRouter.delete('/:id_rol', async (req, res) => {
  const { id_rol } = req.params;
  try {
    const response = await rolesController.deleteRole(id_rol);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default rolesRouter;
