
const secretKey = process.env.SECRET_KEY; 

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
  