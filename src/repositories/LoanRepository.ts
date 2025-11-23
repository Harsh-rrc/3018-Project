import { Loan } from '../models/loanModel';

export class LoanRepository {
  private static instance: LoanRepository;
  private loans: Loan[] = [];

  private constructor() {}

  clear() {
    this.loans = [];
  }

  static getInstance(): LoanRepository {
    if (!LoanRepository.instance) {
      LoanRepository.instance = new LoanRepository();
    }
    return LoanRepository.instance;
  }

  async findAll(): Promise<Loan[]> {
    return this.loans;
  }

  async findById(id: string): Promise<Loan | null> {
    return this.loans.find(l => l.id === id) || null;
  }

  async create(data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt' | 'riskStatus'>): Promise<Loan> {
    const newLoan: Loan = {
      ...data,
      id: Date.now().toString(),
      riskStatus: 'low',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.loans.push(newLoan);
    return newLoan;
  }

  async update(id: string, data: Partial<Loan>): Promise<Loan | null> {
    const loan = await this.findById(id);
    if (!loan) return null;
    Object.assign(loan, data, { updatedAt: new Date() });
    return loan;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.loans.findIndex(l => l.id === id);
    if (index === -1) return false;
    this.loans.splice(index, 1);
    return true;
  }
}