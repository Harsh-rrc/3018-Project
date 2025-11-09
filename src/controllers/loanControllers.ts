import { Request, Response } from 'express';
import { LoanService } from '../services/loanServices';

const loanService = new LoanService();

export const loanController = {
  async getAllLoans(req: Request, res: Response): Promise<void> {
    try {
      const loans = await loanService.getAllLoans();
      res.status(200).json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLoanById(req: Request, res: Response): Promise<void> {
    try {
      const loan = await loanService.getLoanById(req.params.id);
      if (!loan) {
        res.status(404).json({ error: 'Loan not found' });
        return;
      }
      res.status(200).json(loan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLoansByClient(req: Request, res: Response): Promise<void> {
    try {
      const loans = await loanService.getLoansByClientId(req.params.clientId);
      res.status(200).json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getHighRiskLoans(req: Request, res: Response): Promise<void> {
    try {
      const loans = await loanService.getHighRiskLoans();
      res.status(200).json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async createLoan(req: Request, res: Response): Promise<void> {
    try {
      const loan = await loanService.createLoan(req.body);
      res.status(201).json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateLoan(req: Request, res: Response): Promise<void> {
    try {
      const loan = await loanService.updateLoan(req.params.id, req.body);
      if (!loan) {
        res.status(404).json({ error: 'Loan not found' });
        return;
      }
      res.status(200).json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteLoan(req: Request, res: Response): Promise<void> {
    try {
      await loanService.deleteLoan(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
