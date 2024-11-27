const request = require('supertest');
const app = require('../index');
const { db } = require('../database/setup');

describe('Chat Routes', () => {
  let token;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/google/callback')
      .send({ code: 'test-code' });
    token = response.body.token;
  });

  beforeEach(async () => {
    await new Promise((resolve) => {
      db.run('DELETE FROM chat_history', resolve);
    });
  });

  test('POST /api/chat/message should create new message', async () => {
    const response = await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Test message' });

    expect(response.status).toBe(200);
    expect(response.body.response).toBeDefined();
  });

  test('GET /api/chat/history should return chat history', async () => {
    // First create a message
    await request(app)
      .post('/api/chat/message')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Test message' });

    const response = await request(app)
      .get('/api/chat/history')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});