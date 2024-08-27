import express from 'express';
import { login, loginUserToChatWith } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/login-user-to-chat/:id', loginUserToChatWith);

export default router;