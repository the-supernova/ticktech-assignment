import app from '../app.js';
import request from 'supertest';

describe('User API routes', () => {
  let userId;

  // Test GET api/users route
  describe('GET /api/users', () => {
    it('should return an empty array', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // Test POST api/users route
  describe('POST /api/users', () => {
    it('should create a new user and return the created user', async () => {
      const user = {
        username: 'testuser',
        age: 25,
        hobbies: ['reading', 'swimming'],
      };
      const response = await request(app).post('/api/users').send(user);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(user.username);
      expect(response.body.age).toBe(user.age);
      expect(response.body.hobbies).toEqual(user.hobbies);
      userId = response.body.id; // Save the id for later tests
    });
  });

  // Test GET api/users/:userId route
  describe('GET /api/users/:userId', () => {
    it('should return the user with the given id', async () => {
      const response = await request(app).get(`/api/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
    });
  });

  // Test PUT api/users/:userId route
  describe('PUT /api/users/:userId', () => {
    it('should update the user with the given id and return the updated user', async () => {
      const updatedUser = {
        username: 'updateduser',
        age: 30,
        hobbies: ['swimming', 'yoga'],
      };
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', userId);
      expect(response.body.username).toBe(updatedUser.username);
      expect(response.body.age).toBe(updatedUser.age);
      expect(response.body.hobbies).toEqual(updatedUser.hobbies);
    });
  });

  // Test DELETE api/users/:userId route
  describe('DELETE /api/users/:userId', () => {
    it('should delete the user with the given id', async () => {
      const response = await request(app).delete(`/api/users/${userId}`);
      expect(response.status).toBe(204);
    });
  });

  // Test GET api/users/:userId route again to ensure the user is deleted
  describe('GET /api/users/:userId', () => {
    it('should return 404 not found', async () => {
      const response = await request(app).get(`/api/users/${userId}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({"error": "user not found"});
    });
  });
});
