import { LoanRepository } from '../repositories/LoanRepository';
import { Loan } from '../models/loanModel';

export class LoanService {
  private repo = new LoanRepository();

  private assessRisk(amount: number): 'low' | 'medium' | 'high' {
    if (amount <= 10000) return 'low';
    if (amount <= 50000) return 'medium';
    return 'high';
  }

  async getAllLoans(): Promise<Loan[]> {
    return this.repo.findAll();
  }

  async getLoanById(id: string): Promise<Loan | null> {
    return this.repo.findById(id);
  }

  async createLoan(data: Omit<Loan, 'id' | 'riskStatus' | 'createdAt' | 'updatedAt'>): Promise<Loan> {
    const riskStatus = this.assessRisk(data.amount);
    return this.repo.create({ ...data, riskStatus } as Loan);
  }

  async updateLoan(id: string, data: Partial<Loan>): Promise<Loan | null> {
    if (data.amount) data.riskStatus = this.assessRisk(data.amount);
    return this.repo.update(id, data);
  }

  async deleteLoan(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}