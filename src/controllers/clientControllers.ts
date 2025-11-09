import { Request, Response } from 'express';
import { ClientService } from '../services/clientService';

const clientService = new ClientService();

export const ClientController = {
  async createClient(req: Request, res: Response): Promise<void> {
    try {
      const client = await clientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await clientService.getAllClients();
      res.status(200).json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const client = await clientService.getClientById(req.params.id);
      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }
      res.status(200).json(client);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const client = await clientService.updateClient(req.params.id, req.body);
      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }
      res.status(200).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      await clientService.deleteClient(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
};
