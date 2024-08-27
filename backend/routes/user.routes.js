import express from 'express';
import { getUsersForSidebar, getPredefinedUsers, updateUserFullName } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/predefined', getPredefinedUsers);
router.get('/:id', getUsersForSidebar);
router.put('/update/:id', updateUserFullName);

export default router;
