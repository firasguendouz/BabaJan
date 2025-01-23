const request = require('supertest');
const app = require('../../../app');
const User = require('../../../models/User');
const Notification = require('../../../models/Notification');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Mock environment variable
process.env.SUPER_ADMIN_CODE = 'super-secret-code';

describe('Admin User Controller Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('DELETE /api/admin/users/:userId', () => {
    it('should soft delete a user and create a notification', async () => {
      const user = await User.create({ email: 'testuser@example.com', role: 'user' });

      const res = await request(app).delete(`/api/admin/users/${user._id}`).send();

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User deleted successfully');

      const deletedUser = await User.findById(user._id);
      expect(deletedUser.isDeleted).toBe(true);

      const notification = await Notification.findOne({ recipient: user._id });
      expect(notification).toBeTruthy();
      expect(notification.title).toBe('Account Deleted');
    });

    it('should return 404 if user does not exist', async () => {
      const res = await request(app).delete('/api/admin/users/invalid-id').send();
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('GET /api/admin/users', () => {
    it('should fetch all users with pagination', async () => {
      await User.create({ email: 'user1@example.com', role: 'user' });
      await User.create({ email: 'user2@example.com', role: 'admin' });

      const res = await request(app).get('/api/admin/users?page=1&limit=2').send();

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/admin/users/:userId', () => {
    it('should update user fields successfully', async () => {
      const user = await User.create({ email: 'testupdate@example.com', role: 'user' });

      const res = await request(app).put(`/api/admin/users/${user._id}`).send({ role: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User updated successfully.');

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.role).toBe('admin');
    });
  });

  describe('POST /api/admin/register', () => {
    it('should register a new admin successfully', async () => {
      const res = await request(app).post('/api/admin/register').send({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        phone: '1234567890',
        password: 'password123',
        code: 'super-secret-code',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Admin registered successfully.');
    });

    it('should fail with invalid Super Admin code', async () => {
      const res = await request(app).post('/api/admin/register').send({
        firstName: 'Admin',
        lastName: 'User',
        email: 'invalidadmin@example.com',
        phone: '1234567890',
        password: 'password123',
        code: 'wrong-code',
      });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid Super Admin code.');
    });
  });
});