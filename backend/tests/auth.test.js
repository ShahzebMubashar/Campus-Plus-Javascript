const request = require('supertest');
const app = require('../app');

describe('Auth Routes', () => {
    it('GET /auth/test should return working message', async () => {
        const res = await request(app).get('/auth/test');
        expect(res.statusCode).toBe(200);
        expect(res.text).toMatch(/working/i);
    });
}); 