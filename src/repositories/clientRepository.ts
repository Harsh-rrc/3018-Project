import { Client } from '../models/clientModel';
import { db } from '../config/firebase';

export async function getAllClients(): Promise<Client[]> {
  const snapshot = await db.collection('clients').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
}

export async function getClientById(id: string): Promise<Client | null> {
  const doc = await db.collection('clients').doc(id).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Client) : null;
}

export async function createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
  const newClient = {
    ...clientData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const docRef = await db.collection('clients').add(newClient);
  return { id: docRef.id, ...newClient };
}

export async function updateClient(id: string, clientData: Partial<Client>): Promise<Client | null> {
  const updateData = { ...clientData, updatedAt: new Date() };
  await db.collection('clients').doc(id).update(updateData);
  const updatedDoc = await db.collection('clients').doc(id).get();
  return updatedDoc.exists ? ({ id: updatedDoc.id, ...updatedDoc.data() } as Client) : null;
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await db.collection('clients').doc(id).delete();
    return true;
  } catch {
    return false;
  }
}

export async function getClientsByName(name: string): Promise<Client[]> {
  const snapshot = await db.collection('clients').where('name', '>=', name).where('name', '<=', name + '\uf8ff').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
}
