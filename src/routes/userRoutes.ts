import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from '../controllers/userController';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../Validations/userValidation';

const router = Router();

// Login (public)
router.post('/login', login);

// Get all users (protected, roles: admin, manager)
router.get('/', authMiddleware, authorizeRole(['admin', 'manager']), getAllUsers);

// Get user by id (protected, roles: admin, manager)
router.get('/:id', authMiddleware, authorizeRole(['admin', 'manager']), getUserById);

// Create new user (protected, roles: admin)
router.post('/', authMiddleware, authorizeRole(['admin']), validateRequest(createUserSchema), createUser);

// Update user by id (protected, roles: admin)
router.put('/:id', authMiddleware, authorizeRole(['admin']), validateRequest(updateUserSchema), updateUser);

// Delete user by id (protected, roles: admin)
router.delete('/:id', authMiddleware, authorizeRole(['admin']), deleteUser);

export default router;
