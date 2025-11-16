import { ClientRepository } from '../repositories/clientRepository';
import { Client } from '../models/clientModel';
import { sendEmail } from '../utils/emailService';

export class ClientService {
  private repo = new ClientRepository();

  async getAllClients(): Promise<Client[]> {
    return this.repo.findAll();
  }

  async getClientById(id: string): Promise<Client | null> {
    return this.repo.findById(id);
  }

  async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const client = await this.repo.create(data);
    await sendEmail(client.email, 'Welcome to Our Loan Service', 'Thank you for registering with us. We look forward to serving your loan needs.');
    return client;
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client | null> {
    return this.repo.update(id, data);
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
