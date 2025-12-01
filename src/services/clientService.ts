import * as clientRepository from '../repositories/clientRepository';
import { Client } from '../models/clientModel';
import { sendEmail } from '../utils/emailService';

export class ClientService {
  async getAllClients(): Promise<Client[]> {
    return clientRepository.getAllClients();
  }

  async getClientById(id: string): Promise<Client | null> {
    return clientRepository.getClientById(id);
  }

  async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const client = await clientRepository.createClient(clientData);
    try {
      await sendEmail(client.email, 'Welcome to Our Loan Service', 'Thank you for registering with us. We look forward to serving your loan needs.');
    } catch (emailError) {
      console.warn('Failed to send welcome email, but client was created successfully:', emailError);
    }
    return client;
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client | null> {
    return clientRepository.updateClient(id, clientData);
  }

  async deleteClient(id: string): Promise<boolean> {
    return clientRepository.deleteClient(id);
  }

  async getClientsByName(name: string): Promise<Client[]> {
    return clientRepository.getClientsByName(name);
  }
}
