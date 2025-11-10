import { ClientRepository } from '../repositories/clientRepository';
import { Client } from '../models/clientModel';

export class ClientService {
  private repo = new ClientRepository();

  async getAllClients(): Promise<Client[]> {
    return this.repo.findAll();
  }

  async getClientById(id: string): Promise<Client | null> {
    return this.repo.findById(id);
  }

  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    return this.repo.create(data);
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    return this.repo.update(id, data);
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}