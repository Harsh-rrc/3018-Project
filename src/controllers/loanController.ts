import { Request, Response } from 'express';
import { LoanService } from '../services/loanServices';

const service = new LoanService();

export const loanController = {
  getAllLoans(req: Request, res: Response) {
    const filters = {
      status: req.query.status as string | undefined,
      riskStatus: req.query.riskStatus as string | undefined
    };

    const sortField = req.query.sortField as string | undefined;
    const sortOrder: 'asc' | 'desc' = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

    const sort = sortField ? { field: sortField, order: sortOrder } : undefined;

    service.getAllLoans(filters, sort)
      .then(loans => res.json(loans))
      .catch(() => res.status(500).json({ error: 'Failed to fetch loans' }));
  },

  getLoanById(req: Request, res: Response) {
    service.getLoanById(req.params.id)
      .then(loan => {
        if (!loan) return res.status(404).json({ error: 'Loan not found' });
        res.json(loan);
      })
      .catch(() => res.status(500).json({ error: 'Failed to fetch loan' }));
  },

  createLoan(req: Request, res: Response) {
    service.createLoan(req.body)
      .then(newLoan => res.status(201).json(newLoan))
      .catch(() => res.status(400).json({ error: 'Failed to create loan' }));
  },

  updateLoan(req: Request, res: Response) {
    service.updateLoan(req.params.id, req.body)
      .then(updated => {
        if (!updated) return res.status(404).json({ error: 'Loan not found' });
        res.json(updated);
      })
      .catch(() => res.status(400).json({ error: 'Failed to update loan' }));
  },

  deleteLoan(req: Request, res: Response) {
    service.deleteLoan(req.params.id)
      .then(deleted => {
        if (!deleted) return res.status(404).json({ error: 'Loan not found' });
        res.status(204).send();
      })
      .catch(() => res.status(500).json({ error: 'Failed to delete loan' }));
  }
};
