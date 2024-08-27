import express from 'express';
import { deleteConversation } from '../controllers/conversation.controller.js';

const router = express.Router();

router.delete('/delete/:id', deleteConversation);

export default router;