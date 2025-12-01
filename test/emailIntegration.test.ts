import { jest } from "@jest/globals";

import { sendEmail } from "../src/utils/emailService";

jest.mock("../src/utils/emailService", () => ({
  sendEmail: jest.fn(),
}));

import request from "supertest";
import app from "../src/app";

// Mock Firebase token for testing
const adminToken = "mock.firebase.admin.token";

describe("Email Integration", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send a welcome email when a client is created", async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

    const response = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        address: "123 Test St",
      });

    expect(response.status).toBe(201);
    expect(mockSendEmail).toHaveBeenCalledWith(
      "test@example.com",
      "Welcome to Our Loan Service",
      "Thank you for registering with us. We look forward to serving your loan needs."
    );
  });

  it("should send an email when a loan is approved", async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

    // Create a client first
    const clientRes = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        address: "123 Test St",
      });
    const clientId = clientRes.body.id;

    // Create a loan
    const loanRes = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        clientId,
        amount: 10000,
        interestRate: 5,
        duration: 12,
        status: "pending",
      });
    const loanId = loanRes.body.id;

    // Update loan to approved
    const updateRes = await request(app)
      .put(`/api/loans/${loanId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "approved" });

    expect(updateRes.status).toBe(200);

    expect(mockSendEmail).toHaveBeenNthCalledWith(
      2,
      "test@example.com",
      "Loan Approved",
      "Your loan has been approved."
    );
  });

  it("should send an email when a loan is rejected", async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

    // Create a client first
    const clientRes = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        address: "123 Test St",
      });
    const clientId = clientRes.body.id;

    // Create a loan
    const loanRes = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        clientId,
        amount: 10000,
        interestRate: 5,
        duration: 12,
        status: "pending",
      });
    const loanId = loanRes.body.id;

    // Update loan to rejected
    const updateRes = await request(app)
      .put(`/api/loans/${loanId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "rejected" });

    expect(updateRes.status).toBe(200);

    expect(mockSendEmail).toHaveBeenNthCalledWith(
      2,
      "test@example.com",
      "Loan Rejected",
      "We regret to inform you that your loan application has been rejected."
    );
  });
});
