import User from '../models/user';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const appUrl = `http://localhost:${process.env.SERVER_PORT}`;

const testUser = {
  name: 'test',
  email: 'test@example.com',
  password: 'test1234',
  isAdmin: false,
};

const newUser = {
  name: 'newUser1',
  email: 'newUser@example.com',
  password: 'test1234',
  isAdmin: false,
};

async function seedDatabase() {
  const user = new User(testUser);
  await user.save();
}

beforeAll(async () => {
  mongoose.set('strictQuery', true).connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await seedDatabase();
  await User.deleteOne({ email: newUser.email });
});

afterEach(async () => await User.deleteOne(testUser));

afterAll(async () => {
  await User.deleteOne(newUser);
  mongoose.connection.close();
});

describe('Signup', () => {
  it('should find the user in the database and return the error', async () => {
    const response = await request(appUrl)
      .post('/api/auth/signup')
      .send(testUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe('Email already in use');
  });

  it('should create a new user in the database', async () => {
    const response = await request(appUrl)
      .post('/api/auth/signup')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const addedUser = await User.findOne({ email: newUser.email });
    expect(response.statusCode).toBe(201);
    expect(addedUser).not.toBeNull();
  });
});
