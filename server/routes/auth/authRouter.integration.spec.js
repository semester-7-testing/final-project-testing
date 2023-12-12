import User from '../../models/user';
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

describe('Auth router', () => {
  it('on signup it should return the error if user has been found', async () => {
    const response = await request(appUrl)
      .post('/api/auth/signup')
      .send(testUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe('Email already in use');
  });

  it('on signup should create a new user in the database', async () => {
    const response = await request(appUrl)
      .post('/api/auth/signup')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const addedUser = await User.findOne({ email: newUser.email });
    expect(response.statusCode).toBe(201);
    expect(addedUser).not.toBeNull();
  });

  it('on login it should return the error if user has not been found', async () => {
    const user = {
      email: testUser.email,
      password: 'wrongPassword',
    };

    const response = await request(appUrl)
      .post('/api/auth/login')
      .send(user)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe('Invalid credentials');
  });

  it('on login it should return the error if credentials do not match', async () => {
    const response = await request(appUrl)
      .post('/api/auth/login')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe('Invalid credentials');
  });

  it('on login it should return status 200 if the user log in was successful', async () => {
    const testLoginUser = {
      email: 'testLoginUser@gmail.com',
      password: 'testLoginUser',
      name: 'loginUser',
      isAdmin: 'false',
    };

    await request(appUrl)
      .post('/api/auth/signup')
      .send(testLoginUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const response = await request(appUrl)
      .post('/api/auth/login')
      .send(testLoginUser)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    console.log(response.body);
    expect(response.statusCode).toBe(200);
  });
});
