import { Client } from '../models/clientModel';

export class ClientRepository {
  private static instance: ClientRepository;
  private clients: Client[] = [];

  private constructor() {}

  static getInstance(): ClientRepository {
    if (!ClientRepository.instance) {
      ClientRepository.instance = new ClientRepository();
    }
    return ClientRepository.instance;
  }

  clear() {
    this.clients = [];
  }

  async findAll(): Promise<Client[]> {
    return this.clients;
  }

  async findById(id: string): Promise<Client | null> {
    return this.clients.find(c => c.id === id) || null;
  }

  async create(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    const newClient: Client = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.push(newClient);
    return newClient;
  }

  async update(id: string, data: Partial<Client>): Promise<Client | null> {
    const client = await this.findById(id);
    if (!client) return null;
    Object.assign(client, data, { updatedAt: new Date() });
    return client;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.clients.splice(index, 1);
    return true;
  }
}