import { db } from '../config/firebase';
import { Client } from '../models/client';

export class ClientRepository {
  private readonly collection = db.collection('clients');

  async findAll(): Promise<Client[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Client));
  }

  async findById(id: string): Promise<Client | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data()
    } as Client;
  }

  async create(clientData: Omit<Client, 'id'>): Promise<Client> {
    const newClient = {
      ...clientData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await this.collection.add(newClient);
    return {
      id: docRef.id,
      ...newClient
    };
  }

  async update(id: string, clientData: Partial<Client>): Promise<Client | null> {
    const updateData = {
      ...clientData,
      updatedAt: new Date()
    };
    
    await this.collection.doc(id).update(updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    await this.collection.doc(id).delete();
    return true;
  }

  async findByEmail(email: string): Promise<Client | null> {
  const snapshot = await this.collection.where('email', '==', email).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Client;
}
}