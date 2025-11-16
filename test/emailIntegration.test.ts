import { jest } from '@jest/globals';

jest.mock('../src/utils/emailService');

import request from 'supertest';
import app from '../src/app';
import { sendEmail } from '../src/utils/emailService';

describe('Email Integration', () => {
  it('should send an email when a loan is approved', async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

    // Create a client first
    const clientRes = await request(app)
      .post('/api/clients')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St'
      });
    const clientId = clientRes.body.id;

    // Create a loan
    const loanRes = await request(app)
      .post('/api/loans')
      .send({
        clientId,
        amount: 10000,
        interestRate: 5,
        duration: 12,
        status: 'approved'
      });
    const loanId = loanRes.body.id;

    // Check if email was sent
    expect(mockSendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Loan Approved',
      'Your loan has been approved.'
    );
  });
});
