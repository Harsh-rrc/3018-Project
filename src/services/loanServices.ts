import { LoanRepository } from '../repositories/LoanRepository';
import { Loan } from '../models/loanModel';
import { ClientService } from './clientService';
import { sendEmail } from '../utils/emailService';

export class LoanService {
  private repo = LoanRepository.getInstance();
  private clientService = new ClientService();

  private assessRisk(amount: number): 'low' | 'medium' | 'high' {
    if (amount <= 10000) return 'low';
    if (amount <= 50000) return 'medium';
    return 'high';
  }

  async getAllLoans(filters?: { status?: string; riskStatus?: string }, sort?: { field: string; order: 'asc' | 'desc' }): Promise<Loan[]> {
    let loans = await this.repo.findAll();

    // Filtering
    if (filters) {
      if (filters.status) {
        loans = loans.filter(loan => loan.status === filters.status);
      }
      if (filters.riskStatus) {
        loans = loans.filter(loan => loan.riskStatus === filters.riskStatus);
      }
    }

    // Sorting
    if (sort && sort.field) {
      loans = loans.sort((a, b) => {
        const fieldA = (a as any)[sort.field];
        const fieldB = (b as any)[sort.field];
        if (fieldA < fieldB) return sort.order === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sort.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return loans;
  }

  async getLoanById(id: string): Promise<Loan | null> {
    return this.repo.findById(id);
  }

  async createLoan(data: Omit<Loan, 'id' | 'riskStatus' | 'createdAt' | 'updatedAt'>): Promise<Loan> {
    const riskStatus = this.assessRisk(data.amount);
    const loan = await this.repo.create({ ...data, riskStatus } as Loan);
    return loan;
  }

  async updateLoan(id: string, data: Partial<Loan>): Promise<Loan | null> {
    const existingLoan = await this.repo.findById(id);
    if (!existingLoan) return null;

    const oldStatus = existingLoan.status;
    if (data.amount) data.riskStatus = this.assessRisk(data.amount);
    const loan = await this.repo.update(id, data);
    if (loan && data.status === 'approved' && oldStatus !== 'approved') {
      const client = await this.clientService.getClientById(loan.clientId);
      if (client) {
        await sendEmail(client.email, 'Loan Approved', 'Your loan has been approved.');
      }
    }
    if (loan && data.status === 'rejected' && oldStatus !== 'rejected') {
      const client = await this.clientService.getClientById(loan.clientId);
      if (client) {
        await sendEmail(client.email, 'Loan Rejected', 'We regret to inform you that your loan application has been rejected.');
      }
    }
    return loan;
  }

  async deleteLoan(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}