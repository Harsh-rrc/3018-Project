import * as loanRepository from '../repositories/LoanRepository';
import { Loan } from '../models/loanModel';
import { ClientService } from './clientService';
import { sendEmail } from '../utils/emailService';

export class LoanService {
  private clientService = new ClientService();

  async getAllLoans(filters?: { status?: string; riskStatus?: string }, sort?: { field: string; order: 'asc' | 'desc' }): Promise<Loan[]> {
    let loans = await loanRepository.getAllLoans();

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
    return loanRepository.getLoanById(id);
  }

  async createLoan(data: Omit<Loan, 'id' | 'riskStatus' | 'createdAt' | 'updatedAt'>): Promise<Loan> {
    const loan = await loanRepository.createLoan(data);
    return loan;
  }

  async updateLoan(id: string, data: Partial<Loan>): Promise<Loan | null> {
    const existingLoan = await loanRepository.getLoanById(id);
    if (!existingLoan) return null;

    const oldStatus = existingLoan.status;
    const loan = await loanRepository.updateLoan(id, data);
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
    return loanRepository.deleteLoan(id);
  }
}
