import request from "supertest";
import app from "../src/app";

describe("Loan API", () => {
  let adminToken: string;
  let userToken: string;
  let createdLoanId: string;

  beforeAll(() => {
    adminToken = "mock.firebase.admin.token";
    userToken = "mock.firebase.user.token";
  });

  it("should create a new loan", async () => {
    // Create a client first
    const clientRes = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Client",
        email: "testclient@example.com",
        phone: "1234567890",
        address: "123 Client St",
      });

    expect(clientRes.status).toBe(201);
    const clientId = clientRes.body.id;

    const response = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        clientId,
        amount: 20000,
        interestRate: 5,
        duration: 24,
        status: "pending",
      });

    expect(response.status).toBe(201);
    expect(response.body.riskStatus).toBeDefined();
    createdLoanId = response.body.id;
  });

  it("should reject creating loan if not authenticated", async () => {
    const res = await request(app)
      .post("/api/loans")
      .send({
        clientId: "123",
        amount: 10000,
        interestRate: 5,
        duration: 12,
      });
    expect(res.status).toBe(401);
  });

  it("should reject creating loan if user lacks role", async () => {
    const clientRes = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Client User", email: "clientuser@example.com", phone: "1234567890", address: "456 User St" });
    expect(clientRes.status).toBe(403);
  });

  it("should update a loan", async () => {
    const response = await request(app)
      .put(`/api/loans/${createdLoanId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 25000 });
    expect(response.status).toBe(200);
    expect(response.body.amount).toBe(25000);
  });

  it("should get a loan by ID", async () => {
    const response = await request(app)
      .get(`/api/loans/${createdLoanId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdLoanId);
  });

  it("should delete a loan", async () => {
    const response = await request(app)
      .delete(`/api/loans/${createdLoanId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(204);
  });
});
