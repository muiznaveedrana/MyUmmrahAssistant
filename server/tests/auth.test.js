const request = require('supertest');
const app = require('../index');
const { db } = require('../database/setup');

describe('Auth Routes', () => {
  beforeAll(async () => {
    await new Promise((resolve) => db.run('DELETE FROM users', resolve));
  });

  test('POST /api/auth/google/callback should create new user', async () => {
    const response = await request(app)
      .post('/api/auth/google/callback')
      .send({ code: 'test-code' });

    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
  });
});

describe('Protected Routes', () => {
  let token;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/google/callback')
      .send({ code: 'test-code' });
    token = response.body.token;
  });

  test('GET /api/users/me should return user data', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBeDefined();
  });
});