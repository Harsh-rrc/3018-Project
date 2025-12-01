import { Loan } from '../models/loanModel';
import { db } from '../config/firebase';

export async function getAllLoans(): Promise<Loan[]> {
  const snapshot = await db.collection('loans').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Loan));
}

export async function getLoanById(id: string): Promise<Loan | null> {
  const doc = await db.collection('loans').doc(id).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Loan) : null;
}

export async function createLoan(loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'riskStatus'>): Promise<Loan> {
  const riskStatus = assessRisk(loanData.amount);
  const newLoan = {
    ...loanData,
    riskStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const docRef = await db.collection('loans').add(newLoan);
  return { id: docRef.id, ...newLoan };
}

export async function updateLoan(id: string, loanData: Partial<Loan>): Promise<Loan | null> {
  const updateData = { ...loanData, updatedAt: new Date() };
  await db.collection('loans').doc(id).update(updateData);
  const updatedDoc = await db.collection('loans').doc(id).get();
  return updatedDoc.exists ? ({ id: updatedDoc.id, ...updatedDoc.data() } as Loan) : null;
}

export async function deleteLoan(id: string): Promise<boolean> {
  try {
    await db.collection('loans').doc(id).delete();
    return true;
  } catch {
    return false;
  }
}

function assessRisk(amount: number): 'low' | 'medium' | 'high' {
  if (amount <= 10000) return 'low';
  if (amount <= 50000) return 'medium';
  return 'high';
}
