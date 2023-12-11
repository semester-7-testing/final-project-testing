import request from "supertest";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import express from "express";

import chatRoomRouter from "./chatRoomRouter.js";
import ChatRoom from "../models/chatRoom.js";
import * as functions from "./functions.js";

describe('chatRoomRouter', () => {
  dotenv.config();
  let req, res, next;
  const app = express();
  app.use(express.json());
  app.use("/api/chatrooms", chatRoomRouter);

  const chatRoom = {
    category: "testCategory",
    userId: "testUserId",
    socketId: "testSocketId",
    roomId: "testRoomId",
    hasUnreadMessages: true,
    messages: [
      {
        sender: "testSender",
        text: "testText",
        timestamp: "testTimestamp"
      }
    ]
  };
  
  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return 403 is the user is not admin', async () => {
      const user = { email: "test@test.sk", isAdmin: false };
      const token = JWT.sign(user, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      req.header.mockReturnValue(`Bearer ${token}`);

      const response = await request(app)
      .get("/api/chatrooms") 
      .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(403);
    })

    it('should return all chatrooms if the user is admin', async () => {
      jest.spyOn(ChatRoom, 'find').mockImplementation(() => Promise.resolve([chatRoom, chatRoom]));
      jest.spyOn(functions, 'resolveAndMapUserNamesFromQuery').mockImplementation(() => Promise.resolve([{...chatRoom, userName: 'testUserName1'}, {...chatRoom, userName: 'testUserName2'}]));
      const user = { email: "test@test.sk", isAdmin: true };
      const token = JWT.sign(user, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      req.header.mockReturnValue(`Bearer ${token}`);

      const response = await request(app)
      .get("/api/chatrooms")
      .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.chatRooms).toEqual([{...chatRoom, userName: 'testUserName1'}, {...chatRoom, userName: 'testUserName2'}]);
    })
  })
})  