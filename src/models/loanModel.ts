export interface Loan {
  id?: string;
  clientId: string;
  amount: number;
  interestRate: number;
  duration: number; // in months
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  riskStatus: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}