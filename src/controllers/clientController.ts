import { Request, Response } from 'express';
import { ClientService } from '../services/clientService';

const service = new ClientService();

export const clientController = {
  getAllClients(req: Request, res: Response) {
    service.getAllClients()
      .then(clients => res.json(clients))
      .catch(() => res.status(500).json({ error: 'Failed to fetch clients' }));
  },

  getClientById(req: Request, res: Response) {
    service.getClientById(req.params.id)
      .then(client => {
        if (!client) return res.status(404).json({ error: 'Client not found' });
        res.json(client);
      })
      .catch(() => res.status(500).json({ error: 'Error fetching client' }));
  },

  createClient(req: Request, res: Response) {
    service.createClient(req.body)
      .then(newClient => res.status(201).json(newClient))
      .catch(() => res.status(400).json({ error: 'Failed to create client' }));
  },

  updateClient(req: Request, res: Response) {
    service.updateClient(req.params.id, req.body)
      .then(updated => {
        if (!updated) return res.status(404).json({ error: 'Client not found' });
        res.json(updated);
      })
      .catch(() => res.status(400).json({ error: 'Failed to update client' }));
  },

  deleteClient(req: Request, res: Response) {
    service.deleteClient(req.params.id)
      .then(deleted => {
        if (!deleted) return res.status(404).json({ error: 'Client not found' });
        res.status(204).send();
      })
      .catch(() => res.status(500).json({ error: 'Failed to delete client' }));
  }
};
