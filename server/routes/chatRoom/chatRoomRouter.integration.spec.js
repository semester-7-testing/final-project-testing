import request from 'supertest';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import ChatRoom from '../../models/chatRoom.js';
import User from '../../models/user.js';

describe('chatRoomRouter', () => {
  dotenv.config();
  let chatRoom;
  let chatRoomDoc;
  let adminUserDoc;
  let nonAdminUserDoc;

  const adminUser = {
    name: 'testName',
    email: 'testAdmin@gmail.com',
    password: 'testPassword',
    isAdmin: true,
  };

  const nonAdminUser = {
    name: 'testName',
    email: 'testNonAdmin@gmail.com',
    password: 'testPassword',
    isAdmin: false,
  };

  async function seedDb() {
    adminUserDoc = new User(adminUser);
    await adminUserDoc.save();

    nonAdminUserDoc = new User(nonAdminUser);
    await nonAdminUserDoc.save();

    chatRoom = {
      category: 'testCategory',
      userId: nonAdminUserDoc._id,
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
    await ChatRoom.deleteOne({ roomId: chatRoom.roomId });
    await User.deleteOne({ email: adminUser.email });
    await User.deleteOne({ email: nonAdminUser.email });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('get', () => {
    it('should return 403 is the user is not admin', async () => {
      const nonAdminUserPayload = {
        email: nonAdminUser.email,
        isAdmin: false,
        userId: nonAdminUserDoc._id,
      };
      const token = JWT.sign(nonAdminUserPayload, process.env.JWT_SECRET, {
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
      const adminUserPayload = {
        email: adminUser.email,
        isAdmin: true,
        userId: adminUserDoc._id,
      };

      const token = JWT.sign(adminUserPayload, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .get('/api/chatrooms')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.chatRooms).toEqual([
        {
          __v: 0,
          _id: expect.any(String),
          category: chatRoom.category,
          hasUnreadMessages: chatRoom.hasUnreadMessages,
          messages: chatRoom.messages,
          messages: [
            {
              _id: expect.any(String),
              sender: chatRoom.messages[0].sender,
              text: chatRoom.messages[0].text,
              timestamp: chatRoom.messages[0].timestamp,
            },
          ],
          roomId: chatRoom.roomId,
          socketId: chatRoom.socketId,
          userId: nonAdminUserDoc._id.toString(),
          userName: adminUser.name,
        },
      ]);
    });
  });
});
