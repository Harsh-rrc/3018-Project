import { ClientRepository } from '../repositories/clientRepositorys';
import { Client } from '../models/clientModels';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async createClient(clientData: Omit<Client, 'id'>): Promise<Client> {
    // Check if client already exists with the same email
    const existingClient = await this.clientRepository.findByEmail(clientData.email);
    if (existingClient) {
      throw new Error('Client with this email already exists');
    }

    return await this.clientRepository.create(clientData);
  }

  async getAllClients(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }

  async getClientById(id: string): Promise<Client | null> {
    return await this.clientRepository.findById(id);
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client | null> {
    return await this.clientRepository.update(id, clientData);
  }

  async deleteClient(id: string): Promise<boolean> {
    return await this.clientRepository.delete(id);
  }
}