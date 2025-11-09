import { Router } from 'express';
import { loanController } from '../controllers/loanControllers';
import { validateRequest } from '../middleware/validation';
import { createLoanSchema, updateLoanSchema } from '../Validations/loanValidation';

const router = Router();

router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.get('/client/:clientId', loanController.getLoansByClient);
router.get('/high-risk', loanController.getHighRiskLoans);
router.post('/', validateRequest(createLoanSchema), loanController.createLoan);
router.put('/:id', validateRequest(updateLoanSchema), loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

export default router;
