import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Helper to create JWT token for test users
function generateToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Loan API', () => {
  let createdLoanId: string;
  let clientId: string;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Generate tokens
    adminToken = generateToken('adminUserId', 'admin');
    userToken = generateToken('normalUserId', 'user'); // user role without permissions

    // Setup test client with auth header
    const clientRes = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        address: '22 Elm Street'
      });
    clientId = clientRes.body.id;
  });

  it('should create a new loan', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        clientId,
        amount: 12000,
        interestRate: 5,
        duration: 12,
        status: 'pending'
      });
    expect(response.status).toBe(201);
    expect(response.body.riskStatus).toBe('low');
    createdLoanId = response.body.id;
  });

  it('should reject creating loan if not authenticated', async () => {
    const response = await request(app)
      .post('/api/loans')
      .send({
        clientId,
        amount: 12000,
        interestRate: 5,
        duration: 12,
        status: 'pending'
      });
    expect(response.status).toBe(401);
  });

  it('should reject creating loan if user lacks role', async () => {
    const response = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        clientId,
        amount: 12000,
        interestRate: 5,
        duration: 12,
        status: 'pending'
      });
    expect(response.status).toBe(403);
  });

  it('should get all loans', async () => {
    const response = await request(app).get('/api/loans');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get a loan by ID', async () => {
    const response = await request(app).get(`/api/loans/${createdLoanId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdLoanId);
  });

  it('should update a loan', async () => {
    const response = await request(app)
      .put(`/api/loans/${createdLoanId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 60000 });
    expect(response.status).toBe(200);
    expect(response.body.riskStatus).toBe('high');
  });

  it('should reject updating loan if not authenticated', async () => {
    const response = await request(app)
      .put(`/api/loans/${createdLoanId}`)
      .send({ amount: 60000 });
    expect(response.status).toBe(401);
  });

  it('should reject updating loan if non-admin/manager', async () => {
    const response = await request(app)
      .put(`/api/loans/${createdLoanId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 60000 });
    expect(response.status).toBe(403);
  });

  it('should delete a loan', async () => {
    const response = await request(app)
      .delete(`/api/loans/${createdLoanId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(204);
  });

  it('should reject deleting loan if not authenticated', async () => {
    const response = await request(app)
      .delete(`/api/loans/${createdLoanId}`);
    expect(response.status).toBe(401);
  });

  it('should reject deleting loan if non-admin', async () => {
    const response = await request(app)
      .delete(`/api/loans/${createdLoanId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);
  });
});