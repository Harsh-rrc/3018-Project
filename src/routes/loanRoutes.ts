import { Router } from 'express';
import { loanController } from '../controllers/loanController';
import { validateRequest } from '../middleware/validation';
import { createLoanSchema, updateLoanSchema } from '../Validations/loanValidation';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/loans:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a list of loans with optional filtering and sorting
 *     tags: [Loans]
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, active, completed]
 *         description: Filter loans by status
 *       - name: riskStatus
 *         in: query
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter loans by risk status
 *       - name: sortField
 *         in: query
 *         schema:
 *           type: string
 *           enum: [amount, interestRate, duration, status, riskStatus]
 *         description: Field name to sort by
 *       - name: sortOrder
 *         in: query
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order ascending or descending
 *     responses:
 *       '200':
 *         description: Successfully retrieved loans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Loan'
 */
router.get('/', authMiddleware, loanController.getAllLoans);

/**
 * @openapi
 * /api/loans/{id}:
 *   get:
 *     summary: Get a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the loan
 *     responses:
 *       '200':
 *         description: Loan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       '404':
 *         description: Loan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', loanController.getLoanById);

/**
 * @openapi
 * /api/loans:
 *   post:
 *     summary: Create a new loan
 *     tags: [Loans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - amount
 *               - interestRate
 *               - duration
 *             properties:
 *               clientId:
 *                 type: string
 *                 example: "client123"
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1000000
 *                 example: 50000
 *               interestRate:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 5.5
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 360
 *                 example: 60
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, active, completed]
 *                 default: pending
 *                 example: "pending"
 *     responses:
 *       '201':
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Client not found
 */
router.post('/', validateRequest(createLoanSchema), loanController.createLoan);

/**
 * @openapi
 * /api/loans/{id}:
 *   put:
 *     summary: Update a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the loan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1000000
 *                 example: 60000
 *               interestRate:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 6.0
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 360
 *                 example: 72
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, active, completed]
 *                 example: "approved"
 *     responses:
 *       '200':
 *         description: Loan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Loan'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Loan not found
 */
router.put('/:id', validateRequest(updateLoanSchema), loanController.updateLoan);

/**
 * @openapi
 * /api/loans/{id}:
 *   delete:
 *     summary: Delete a loan by ID
 *     tags: [Loans]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the loan
 *     responses:
 *       '204':
 *         description: Loan deleted successfully
 *       '404':
 *         description: Loan not found
 */
router.delete('/:id', loanController.deleteLoan);

export default router;
