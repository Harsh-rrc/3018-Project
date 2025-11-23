import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

function generateToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Client API', () => {
  let createdClientId: string;
  let adminToken: string;

  beforeAll(() => {
    adminToken = generateToken('adminUserId', 'admin');
  });

  it('should create a new client', async () => {
    const response = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St'
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John Doe');
    createdClientId = response.body.id;
  });

  it('should get all clients', async () => {
    const response = await request(app).get('/api/clients');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a client by ID', async () => {
    const response = await request(app).get(`/api/clients/${createdClientId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdClientId);
  });

  it('should update a client', async () => {
    const response = await request(app)
      .put(`/api/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ address: '456 New Ave' });
    expect(response.status).toBe(200);
    expect(response.body.address).toBe('456 New Ave');
  });

  it('should delete a client', async () => {
    const response = await request(app)
      .delete(`/api/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(204);
  });
});
