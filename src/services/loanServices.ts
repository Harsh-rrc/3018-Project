import { LoanRepository } from '../repositories/LoanRepository';
import { Loan } from '../models/loanModel';
import { ClientService } from './clientService';
import { sendEmail } from '../utils/emailService';

export class LoanService {
  private repo = new LoanRepository();
  private clientService = new ClientService();

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
    const loan = await this.repo.create({ ...data, riskStatus } as Loan);
    if (loan.status === 'approved') {
      const client = await this.clientService.getClientById(loan.clientId);
      if (client) {
        await sendEmail(client.email, 'Loan Approved', 'Your loan has been approved.');
      }
    }
    return loan;
  }

  async updateLoan(id: string, data: Partial<Loan>): Promise<Loan | null> {
    if (data.amount) data.riskStatus = this.assessRisk(data.amount);
    const loan = await this.repo.update(id, data);
    if (loan && data.status === 'approved' && loan.status !== 'approved') {
      const client = await this.clientService.getClientById(loan.clientId);
      if (client) {
        await sendEmail(client.email, 'Loan Approved', 'Your loan has been approved.');
      }
    }
    return loan;
  }

  async deleteLoan(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}