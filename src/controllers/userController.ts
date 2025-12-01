import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getAuth } from 'firebase-admin/auth';
import { db } from '../config/firebase';
import * as userService from '../services/userService';

// Login endpoint - verifies Firebase token and returns user info
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    res.status(400).json({ error: 'ID token required' });
    return;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    res.status(200).json({
      user: {
        id: decodedToken.uid,
        email: decodedToken.email,
        role: userData?.role || 'user'
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
});

// Get single user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user: any = await userService.getUserById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json(user);
});

// Create new user
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});

// Update user by ID
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ message: 'User updated' });
});

// Delete user by ID
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  res.status(204).send();
});
