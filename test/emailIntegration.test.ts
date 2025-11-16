import { jest } from '@jest/globals';

jest.mock('../src/utils/emailService');

import request from 'supertest';
import app from '../src/app';
import { sendEmail } from '../src/utils/emailService';

describe('Email Integration', () => {
  it('should send a welcome email when a client is created', async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

    await request(app)
      .post('/api/clients')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St'
      });

    expect(mockSendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Welcome to Our Loan Service',
      'Thank you for registering with us. We look forward to serving your loan needs.'
    );
  });

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
        status: 'pending'
      });
    const loanId = loanRes.body.id;

    // Update loan to approved
    await request(app)
      .put(`/api/loans/${loanId}`)
      .send({ status: 'approved' });

    // Check if email was sent
    expect(mockSendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Loan Approved',
      'Your loan has been approved.'
    );
  });

  it('should send an email when a loan is rejected', async () => {
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
        status: 'pending'
      });
    const loanId = loanRes.body.id;

    // Update loan to rejected
    await request(app)
      .put(`/api/loans/${loanId}`)
      .send({ status: 'rejected' });

    // Check if email was sent
    expect(mockSendEmail).toHaveBeenCalledWith(
      'test@example.com',
      'Loan Rejected',
      'We regret to inform you that your loan application has been rejected.'
    );
  });
});
