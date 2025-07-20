import request from 'supertest';
import express from 'express';
import { register, login } from '../controllers/authController';
import User from '../models/User';

const app = express();
app.use(express.json());

// Mock routes for testing
app.post('/register', register);
app.post('/login', login);

describe('Auth Controller', () => {
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should not register user with existing email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      // Create first user
      await request(app).post('/register').send(userData);

      // Try to create second user with same email
      const response = await request(app)
        .post('/register')
        .send({ ...userData, username: 'differentuser' })
        .expect(400);

      expect(response.body.msg).toBe('User already exists');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post('/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.msg).toBe('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.msg).toBe('Invalid credentials');
    });
  });
}); 