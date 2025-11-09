import { BaseRepository } from './BaseRepositorys';
import { Loan } from '../models/loanModels';
import { db } from '../config/firebase';

export class LoanRepository extends BaseRepository<Loan> {
  constructor() {
    super('loans'); // collection name
  }

  async findByClientId(clientId: string): Promise<Loan[]> {
    const snapshot = await db
      .collection(this.collectionName)
      .where('clientId', '==', clientId)
      .get();
      
    return snapshot.docs.map(doc => doc.data() as Loan);
  }

  async findByStatus(status: string): Promise<Loan[]> {
    const snapshot = await db
      .collection(this.collectionName)
      .where('status', '==', status)
      .get();
      
    return snapshot.docs.map(doc => doc.data() as Loan);
  }
}