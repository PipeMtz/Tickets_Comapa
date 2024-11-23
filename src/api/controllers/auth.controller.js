import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userController from '../controllers/users.controller.js'; // Importa todas las funciones del controlador
import pool from '../../config/db.config.js'; // Importa el pool de conexiones
import config from '../../config/db.config.js'; // Asegúrate de tener tu llave secreta en tu configuración

// const { secretKey } = config;
const secretKey = process.env.SECRET_KEY;

//Registro del usuario
export const register = async (req, res) => {
  const { nombre, email, contrasena, role } = req.body;
  console.log(req.body);
  try {
    // Verificar si el usuario ya existe
    const existingUser = await userController.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Ahora pasa el 'role' a createUser
    const newUser = await userController.createUser(nombre, email, hashedPassword, role);

    const token = jwt.sign({ id_usuario: newUser.id_usuario, role: newUser.role }, secretKey, { expiresIn: '1h' });
    console.log(token);
    res.status(201).json({ message: 'Usuario creado con éxito', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Login del usuario
export const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const user = await userController.getUserByEmail(email); // Usa la función del controlador

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena); // Usa 'contrasena' en lugar de 'password'

    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Obtener el rol del usuario desde la tabla usuario_roles
    const [userRoleData] = await pool.execute('SELECT r.nombre_rol FROM usuario_roles ur JOIN roles r ON ur.id_rol = r.id_rol WHERE ur.id_usuario = ?', [user.id_usuario]);
    
    const userRole = userRoleData.length ? userRoleData[0].nombre_rol : null;

    const token = jwt.sign({ id_usuario: user.id_usuario, role: userRole }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validación del token (Middleware)
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.id_usuario;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al autenticar el token' });
  }
};
