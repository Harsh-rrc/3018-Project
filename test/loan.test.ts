import request from 'supertest';
import app from '../src/app';

describe('Loan API', () => {
  let createdLoanId: string;
  let clientId: string;

  beforeAll(async () => {
    const clientRes = await request(app)
      .post('/api/clients')
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
      .send({ amount: 60000 });
    expect(response.status).toBe(200);
    expect(response.body.riskStatus).toBe('high');
  });

  it('should delete a loan', async () => {
    const response = await request(app).delete(`/api/loans/${createdLoanId}`);
    expect(response.status).toBe(204);
  });
});