const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { DB_HOST } = process.env;

const testUser = {
  email: "test2@gmail.com",
  password: "123456",
};

describe("login test", () => {
  beforeAll(async () => {
    mongoose.set("strictQuery", true);

    await mongoose
      .connect(DB_HOST)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });

    await request(app).post("/api/users/register").send(testUser);
  });

  it("successful login", async () => {
    const res = await request(app).post("/api/users/login").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toMatchObject({
      user: {
        email: expect.any(String),
        subscription: expect.any(String),
      },
    });
  });

  it("throw error if req.body is empty", async () => {
    const res = await request(app).post("/api/users/login").send({});

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch('{"message":"missing fields"}');
  });

  it("throw error if req.body doesn't have an email field", async () => {
    const res = await request(app).post("/api/users/login").send({
      password: testUser.password,
    });

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch('{"message":"Email is a required field"}');
  });

  it("throw error if req.body have a wrong email", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "wrong@gmail.com",
      password: testUser.password,
    });

    expect(res.status).toBe(401);
    expect(res.error.text).toMatch('{"message":"Email or password is wrong"}');
  });

  it("throw error if req.body have an invalid email", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "invalid@gmailcom",
      password: testUser.password,
    });

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch('{"message":"Invalid email format"}');
  });

  it("throw error if req.body doesn't have a password field", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: testUser.email,
    });

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch(
      '{"message":"Password is a required field"}'
    );
  });

  it("throw error if req.body have a wrong password", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: "654321",
    });

    expect(res.status).toBe(401);
    expect(res.error.text).toMatch('{"message":"Email or password is wrong"}');
  });

  it("throw error if req.body have an invalid password", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: "12345",
    });

    expect(res.status).toBe(400);
    expect(res.error.text).toMatch(
      '{"message":"Password length must be at least 6 characters long"}'
    );
  });

  afterAll(async () => {
    await mongoose
      .disconnect(DB_HOST)
      .then(() => console.log("Database disconnected"));
  });
});
