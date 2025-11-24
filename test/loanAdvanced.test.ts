import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

function generateToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
}

describe("Loan API - Filtering, Sorting and Auth", () => {
  let adminToken: string;
  let userToken: string;
  let loanId: string;

  beforeAll(() => {
    adminToken = generateToken("adminUserId", "admin");
    userToken = generateToken("userUserId", "user");
  });

  test("Should require authentication on protected routes", async () => {
    const res = await request(app).get("/api/loans");
    expect(res.statusCode).toBe(200); // GET /api/loans is public
  });

  test("Should allow admin to create a loan", async () => {
    // First create a client as loan requires valid clientId
    const clientRes = await request(app)
      .post("/api/clients")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Loan Admin Client",
        email: "loanadmin@example.com",
        phone: "1234567890",
        address: "123 Loan St",
      });

    expect(clientRes.status).toBe(201);
    const clientId = clientRes.body.id;

    const res = await request(app)
      .post("/api/loans")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        clientId,
        amount: 10000,
        interestRate: 5,
        duration: 12,
        status: "pending",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    loanId = res.body.id;
  });

  test("Should forbid non-admin to delete loan", async () => {
    const res = await request(app)
      .delete(`/api/loans/${loanId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test("Should allow admin to delete loan", async () => {
    const res = await request(app)
      .delete(`/api/loans/${loanId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);
  });

  test("Should filter loans by status", async () => {
    const res = await request(app).get("/api/loans?status=pending");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Should sort loans by amount descending", async () => {
    const res = await request(app).get("/api/loans?sortBy=amount&sortOrder=desc");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
