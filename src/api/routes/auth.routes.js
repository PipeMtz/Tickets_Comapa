import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

// authRouter.get('/protected', verifyToken, (req, res) => {
//   res.json({ message: 'This is a protected route', userId: req.userId, role: req.userRole });
// });

export default authRouter;
