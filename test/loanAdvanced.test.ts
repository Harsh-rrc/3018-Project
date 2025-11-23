import request from 'supertest';
import app from '../src/app';

let adminToken = '';
let userToken = '';
let loanId = '';

beforeAll(async () => {
  // Simulate user sign in or setup tokens here
  // Replace with actual auth logic or mocks for real tests
  adminToken = 'Bearer admin_valid_jwt_token';
  userToken = 'Bearer user_valid_jwt_token';

  // Create a loan with admin token for further test usage
  const res = await request(app)
    .post('/api/loans')
    .set('Authorization', adminToken)
    .send({
      clientId: 'testclient1',
      amount: 30000,
      interestRate: 5,
      duration: 36,
      status: 'pending'
    });
  loanId = res.body.id;
});

describe('Loan API - Filtering, Sorting and Auth', () => {
  test('Should require authentication on protected routes', async () => {
    const res = await request(app).get('/api/loans');
    expect(res.statusCode).toBe(401);
  });

  test('Should allow admin to create a loan', async () => {
    const res = await request(app)
      .post('/api/loans')
      .set('Authorization', adminToken)
      .send({
        clientId: 'testclient2',
        amount: 15000,
        interestRate: 4,
        duration: 24,
        status: 'pending'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('Should filter loans by status', async () => {
    const res = await request(app)
      .get('/api/loans?status=pending')
      .set('Authorization', userToken);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((loan: any) => loan.status === 'pending')).toBe(true);
  });

  test('Should sort loans by amount descending', async () => {
    const res = await request(app)
      .get('/api/loans?sortField=amount&sortOrder=desc')
      .set('Authorization', userToken);
    expect(res.statusCode).toBe(200);
    const amounts = res.body.map((loan: any) => loan.amount);
    const sorted = [...amounts].sort((a, b) => b - a);
    expect(amounts).toEqual(sorted);
  });

  test('Should forbid non-admin to delete loan', async () => {
    const res = await request(app)
      .delete(`/api/loans/${loanId}`)
      .set('Authorization', userToken);
    expect(res.statusCode).toBe(403);
  });

  test('Should allow admin to delete loan', async () => {
    const res = await request(app)
      .delete(`/api/loans/${loanId}`)
      .set('Authorization', adminToken);
    expect(res.statusCode).toBe(204);
  });
});
