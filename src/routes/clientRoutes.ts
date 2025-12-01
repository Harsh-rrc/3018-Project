import { Router } from 'express';
import { clientController } from '../controllers/clientController';
import { validateRequest } from '../middleware/validation';
import { createClientSchema, updateClientSchema } from '../Validations/clientValidation';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/clients:
 *   get:
 *     summary: Retrieve a list of clients with optional filtering
 *     tags: [Clients]
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of clients to return
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter clients by name
 *     responses:
 *       '200':
 *         description: Successfully retrieved clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 */
router.get('/', authMiddleware, clientController.getAllClients);

/**
 * @openapi
 * /api/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the client
 *     responses:
 *       '200':
 *         description: Client retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', authMiddleware, clientController.getClientById);

/**
 * @openapi
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 15
 *                 example: "+1234567890"
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "123 Main St, City, Country"
 *     responses:
 *       '201':
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '409':
 *         description: Client with this email already exists
 */
router.post('/', authMiddleware, authorizeRole(['admin', 'manager', 'user']), validateRequest(createClientSchema), clientController.createClient);

/**
 * @openapi
 * /api/clients/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane@example.com"
 *               phone:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 15
 *                 example: "+0987654321"
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "456 Elm St, City, Country"
 *     responses:
 *       '200':
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Client not found
 */
router.put('/:id', authMiddleware, authorizeRole(['admin', 'manager']), validateRequest(updateClientSchema), clientController.updateClient);

/**
 * @openapi
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the client
 *     responses:
 *       '204':
 *         description: Client deleted successfully
 *       '404':
 *         description: Client not found
 */
router.delete('/:id', authMiddleware, authorizeRole(['admin']), clientController.deleteClient);

export default router;
