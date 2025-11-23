import { Request, Response } from 'express';
import { LoanService } from '../services/loanServices';
import { loanQuerySchema } from '../Validations/loanValidation';

const service = new LoanService();

export const loanController = {
  async getAllLoans(req: Request, res: Response) {
    const { error, value } = loanQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const filters = {
      status: value.status,
      riskStatus: value.riskStatus
    };

    const sort = value.sortField ? { field: value.sortField, order: value.sortOrder || 'asc' } : undefined;

    try {
      const loans = await service.getAllLoans(filters, sort);
      res.json(loans);
    } catch {
      res.status(500).json({ error: 'Failed to fetch loans' });
    }
  },

  async getLoanById(req: Request, res: Response) {
    try {
      const loan = await service.getLoanById(req.params.id);
      if (!loan) return res.status(404).json({ error: 'Loan not found' });
      res.json(loan);
    } catch {
      res.status(500).json({ error: 'Failed to fetch loan' });
    }
  },

  async createLoan(req: Request, res: Response) {
    try {
      const newLoan = await service.createLoan(req.body);
      res.status(201).json(newLoan);
    } catch {
      res.status(400).json({ error: 'Failed to create loan' });
    }
  },

  async updateLoan(req: Request, res: Response) {
    try {
      const updated = await service.updateLoan(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Loan not found' });
      res.json(updated);
    } catch {
      res.status(400).json({ error: 'Failed to update loan' });
    }
  },

  async deleteLoan(req: Request, res: Response) {
    try {
      const deleted = await service.deleteLoan(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Loan not found' });
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Failed to delete loan' });
    }
  }
};
