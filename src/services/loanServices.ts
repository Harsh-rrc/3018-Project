import { LoanRepository } from '../repositories/LoanRepositorys';
import { Loan, LoanStatus } from '../models/loanModels';

export class LoanService {
  private loanRepository: LoanRepository;

  constructor() {
    this.loanRepository = new LoanRepository();
  }

  // Simple risk assessment based on amount
  private assessRisk(amount: number): 'low' | 'medium' | 'high' {
    if (amount <= 10000) return 'low';
    if (amount <= 50000) return 'medium';
    return 'high';
  }

  // Create a loan with risk assessment and default status
  async createLoan(
    loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'riskStatus' | 'status'>
  ): Promise<Loan> {
    const riskStatus = this.assessRisk(loanData.amount);
    const loanWithRisk: Loan = {
      ...loanData,
      riskStatus,
      status: 'pending' as LoanStatus,
    };

    return await this.loanRepository.create(loanWithRisk);
  }

  // Get all loans
  async getAllLoans(): Promise<Loan[]> {
    return await this.loanRepository.findAll();
  }

  // Get loan by ID
  async getLoanById(id: string): Promise<Loan | null> {
    return await this.loanRepository.findById(id);
  }

  // Get loans by client ID
  async getLoansByClientId(clientId: string): Promise<Loan[]> {
    return await this.loanRepository.findByClientId(clientId);
  }

  // Update loan and re-assess risk if amount changes
  async updateLoan(id: string, loanData: Partial<Loan>): Promise<Loan | null> {
    if (loanData.amount) {
      loanData.riskStatus = this.assessRisk(loanData.amount);
    }
    return await this.loanRepository.update(id, loanData);
  }

  // Delete loan
  async deleteLoan(id: string): Promise<boolean> {
    return await this.loanRepository.delete(id);
  }

  // Optional helper: get only high-risk loans
  async getHighRiskLoans(): Promise<Loan[]> {
    const allLoans = await this.loanRepository.findAll();
    return allLoans.filter(loan => loan.riskStatus === 'high');
  }
}