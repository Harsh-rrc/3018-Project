import { db } from '../config/firebase';

export abstract class BaseRepository<T> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const docRef = db.collection(this.collectionName).doc();
    const newData = {
      ...data,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await docRef.set(newData);
    return newData as T;
  }

  async findById(id: string): Promise<T | null> {
    const doc = await db.collection(this.collectionName).doc(id).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async findAll(): Promise<T[]> {
    const snapshot = await db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => doc.data() as T);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    
    await db.collection(this.collectionName).doc(id).update(updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    await db.collection(this.collectionName).doc(id).delete();
    return true;
  }
}