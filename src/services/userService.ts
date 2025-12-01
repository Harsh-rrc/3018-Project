import { User } from '../models/userModel';
import { db } from '../config/firebase';

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function getUserById(id: string): Promise<User | null> {
  const doc = await db.collection('users').doc(id).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as User) : null;
}

export async function createUser(userData: { email: string; password: string; role?: string }): Promise<User> {
  // Note: Password should be hashed in production
  const newUser = {
    email: userData.email,
    password: userData.password, // In production, hash this
    role: userData.role || 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const docRef = await db.collection('users').add(newUser);
  return { id: docRef.id, ...newUser };
}

export async function updateUser(id: string, userData: any): Promise<void> {
  const updateData = { ...userData, updatedAt: new Date() };
  await db.collection('users').doc(id).update(updateData);
}

export async function deleteUser(id: string): Promise<void> {
  await db.collection('users').doc(id).delete();
}
