import express from 'express';

import { sendMessage, getMessages, getAutoResponse, updateMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/send', sendMessage);
router.get('/auto-response', getAutoResponse);
router.put('/update/:id', updateMessage);

export default router;
