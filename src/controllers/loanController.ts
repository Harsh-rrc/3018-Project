import { Request, Response } from 'express';
import { LoanService } from '../services/loanServices';
import { loanQuerySchema } from '../Validations/loanValidation';
import { asyncHandler } from '../middleware/asyncHandler';

const service = new LoanService();

export const loanController = {
  getAllLoans: asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = loanQuerySchema.validate(req.query);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const filters = {
      status: value.status,
      riskStatus: value.riskStatus
    };

    const sort = value.sortField ? { field: value.sortField, order: value.sortOrder || 'asc' } : undefined;

    const loans = await service.getAllLoans(filters, sort);
    res.json(loans);
  }),

  getLoanById: asyncHandler(async (req: Request, res: Response) => {
    const loan = await service.getLoanById(req.params.id);
    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }
    res.json(loan);
  }),

  createLoan: asyncHandler(async (req: Request, res: Response) => {
    const newLoan = await service.createLoan(req.body);
    res.status(201).json(newLoan);
  }),

  updateLoan: asyncHandler(async (req: Request, res: Response) => {
    const updated = await service.updateLoan(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }
    res.json(updated);
  }),

  deleteLoan: asyncHandler(async (req: Request, res: Response) => {
    const deleted = await service.deleteLoan(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }
    res.status(204).send();
  }),
};
