import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

function generateToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
}

describe("Loan API", () => {
  let adminToken: string;
  let userToken: string;
  let createdLoanId: string;

  beforeAll(() => {
    adminToken = generateToken("adminUserId", "admin");
    userToken = generateToken("userUserId", "user");
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
      .get(`/api/loans/${createdLoanId}`);
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
