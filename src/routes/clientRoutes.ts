import { Router, RequestHandler } from 'express';
import { ClientController } from '../controllers/clientControllers';

const router = Router();

router.post('/', ClientController.createClient as RequestHandler);
router.get('/', ClientController.getAllClients as RequestHandler);
router.get('/:id', ClientController.getClientById as RequestHandler);
router.put('/:id', ClientController.updateClient as RequestHandler);
router.delete('/:id', ClientController.deleteClient as RequestHandler);

export default router;