import request from 'supertest';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import ChatRoom from '../../models/chatRoom.js';

describe('chatRoomRouter', () => {
  dotenv.config();

  const chatRoom = {
    category: 'testCategory',
    userId: 'testUserId',
    socketId: 'testSocketId',
    roomId: 'testRoomId',
    hasUnreadMessages: true,
    messages: [
      {
        sender: 'testSender',
        text: 'testText',
        timestamp: 'testTimestamp',
      },
    ],
  };

  let chatRoomDoc;

  async function seedDb() {
    chatRoomDoc = new ChatRoom(chatRoom);
    await chatRoomDoc.save();
  }

  beforeAll(() => {
    mongoose
      .set('strictQuery', true) // remove a mongoose warning
      .connect(process.env.MONGO_URI);
  });

  beforeEach(async () => {
    await seedDb();
  });

  afterEach(async () => {
    await ChatRoom.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('get', () => {
    it('should return 403 is the user is not admin', async () => {
      const user = { email: 'test@test.sk', isAdmin: false };
      const token = JWT.sign(user, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .get('/api/chatrooms')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    });

    it('should return 200 if the user is admin', async () => {
      const user = { email: 'test@test.sk', isAdmin: true };
      const token = JWT.sign(user, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .get('/api/chatrooms')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });
  });
});
