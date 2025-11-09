import { Router } from 'express';
import { ClientController } from '../controllers/clientControllers';
import { validateRequest } from '../middleware/validation';
import { createClientSchema, updateClientSchema } from '../Validations/clientValidation';

const router = Router();

router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientById);
router.post('/', validateRequest(createClientSchema), ClientController.createClient);
router.put('/:id', validateRequest(updateClientSchema), ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

export default router;
