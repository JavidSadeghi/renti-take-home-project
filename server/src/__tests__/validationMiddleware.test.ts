import request from 'supertest';
import express from 'express';
import { validateRegistration, validateLogin, validateStandup } from '../middlewares/validationMiddleware';
import { register, login } from '../controllers/authController';
import { createOrUpdateStandup } from '../controllers/standupController';

const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/register', validateRegistration, register);
app.post('/login', validateLogin, login);
app.post('/standup', validateStandup, createOrUpdateStandup);

describe('Validation Middleware', () => {
  describe('Registration Validation', () => {
    it('should pass with valid registration data', async () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/register')
        .send(validData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
    });

    it('should fail with invalid username', async () => {
      const invalidData = {
        username: 'ab', // Too short
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('username');
    });

    it('should fail with invalid email', async () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('email');
    });

    it('should fail with weak password', async () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123' // Too short and no letters
      };

      const response = await request(app)
        .post('/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('password');
    });
  });

  describe('Login Validation', () => {
    it('should pass with valid login data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(validData)
        .expect(401); // Will fail because user doesn't exist, but validation passes

      expect(response.body).toHaveProperty('msg');
    });

    it('should fail with invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('email');
    });

    it('should fail with empty password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: ''
      };

      const response = await request(app)
        .post('/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('password');
    });
  });

  describe('Standup Validation', () => {
    it('should pass with valid standup data', async () => {
      const validData = {
        yesterday: 'Completed user authentication feature',
        today: 'Working on dashboard UI improvements',
        blockers: 'Waiting for design feedback'
      };

      const response = await request(app)
        .post('/standup')
        .send(validData)
        .expect(401); // Will fail because no auth token, but validation passes

      expect(response.body).toHaveProperty('message');
    });

    it('should fail with missing yesterday field', async () => {
      const invalidData = {
        today: 'Working on dashboard UI improvements',
        blockers: 'Waiting for design feedback'
      };

      const response = await request(app)
        .post('/standup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('yesterday');
    });

    it('should fail with missing today field', async () => {
      const invalidData = {
        yesterday: 'Completed user authentication feature',
        blockers: 'Waiting for design feedback'
      };

      const response = await request(app)
        .post('/standup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(1);
      expect(response.body.errors[0].field).toBe('today');
    });

    it('should pass with empty blockers field', async () => {
      const validData = {
        yesterday: 'Completed user authentication feature',
        today: 'Working on dashboard UI improvements',
        blockers: ''
      };

      const response = await request(app)
        .post('/standup')
        .send(validData)
        .expect(401); // Will fail because no auth token, but validation passes

      expect(response.body).toHaveProperty('message');
    });
  });
}); 