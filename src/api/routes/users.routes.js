import express from 'express';
const usersRouter = express.Router();
import { getAllUsers, getUserById, updateUser, deleteUser, createUser, getAllUsersWithDetails, updateUserAdmin , getTicketsAbiertosUser} from '../controllers/users.controller.js';

// Ruta para crear un nuevo usuario y asignarle un rol
usersRouter.post('/', async (req, res) => {
  const { nombre, email, contrasena} = req.body;
  const role = 'user';
  console.log('Datos recibidos para crear el usuario:', { nombre, email, contrasena, role });
  try {
    const newUser = await createUser(nombre, email, contrasena, role);
    res.status(201).json({ message: 'Usuario creado con éxito', newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener todos los usuarios
usersRouter.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener todos los usuarios con roles y departamentos
usersRouter.get('/detalles', async (req, res) => {
  try {
    const users = await getAllUsersWithDetails();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

usersRouter.get('/tickets-abiertos', async (req, res) => {
  try {
    const users = await getTicketsAbiertosUser();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Ruta para obtener un usuario por su ID
usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para actualizar un usuario
usersRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, contrasena } = req.body;
  try {
    const updatedUser = await updateUser(id, nombre, email, contrasena);
    res.status(200).json({ message: 'Usuario actualizado con éxito', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para eliminar un usuario
usersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Ruta para actualizar el departamento y rol de un usuario
usersRouter.put('/:id/actualizar', async (req, res) => {
  const { id } = req.params;
  const { nuevoDepartamento, nuevoRol } = req.body;

  try {
    const updatedUser = await updateUserAdmin(id, nuevoDepartamento, nuevoRol);
    res.status(200).json({ message: 'Usuario actualizado con éxito', updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




export default usersRouter;
