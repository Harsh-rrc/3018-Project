export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan {
  id: string;
  clientId: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  riskStatus: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}