import { Router } from 'express';
import { checkAdmin, checkAuth } from '../../middleware/auth.js';
import ChatRoom from '../../models/chatRoom.js';
import {
  resolveAndMapUserNamesFromQuery,
  resolveAndMapUserNameFromQuery,
} from '../functions.js';

const router = Router();

router.get('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    let chatRooms = await ChatRoom.find();
    chatRooms = await resolveAndMapUserNamesFromQuery(chatRooms);
    res.status(200).json({
      errors: [],
      data: {
        chatRooms,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errors: [
        {
          msg: error.message,
        },
      ],
      data: null,
    });
  }
});

router.post('/', checkAuth, async (req, res) => {
  try {
    await ChatRoom.create(req.body);
    res.status(201).json({
      errors: [],
      data: null,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errors: [
        {
          msg: error.message,
        },
      ],
      data: null,
    });
  }
});

router.get('/:socketId', checkAuth, checkAdmin, async (req, res) => {
  try {
    let chatRoom = await ChatRoom.findOne({ socketId: req.params.socketId });
    if (!chatRoom) {
      return res.status(404).json({
        errors: [
          {
            msg: 'Chat room not found',
          },
        ],
        data: null,
      });
    }
    chatRoom = await resolveAndMapUserNameFromQuery(chatRoom);
    res.status(200).json({
      errors: [],
      data: {
        chatRoom,
      },
    });
  } catch (error) {
    res.status(404).json({
      errors: [
        {
          msg: 'Chat room not found',
        },
      ],
      data: null,
    });
  }
});

router.delete('/', checkAuth, checkAdmin, async (req, res) => {
  try {
    await ChatRoom.deleteMany({});

    res.status(200).json({
      errors: [],
      data: {},
    });
  } catch (error) {
    console.log(error);
  }
});

router.patch(
  '/:socketId/messages/read',
  checkAuth,
  checkAdmin,
  async (req, res) => {
    try {
      const chatRoom = await ChatRoom.findOneAndUpdate(
        { roomId: req.params.socketId },
        { $set: { hasUnreadMessages: false } }
      );

      if (!chatRoom) {
        return res.status(404).json({
          errors: [
            {
              msg: 'Chat room not found',
            },
          ],
          data: null,
        });
      }

      res.status(200).json({
        errors: [],
        data: {},
      });
    } catch (error) {
      res.status(500).json({
        errors: [
          {
            msg: error,
          },
        ],
        data: null,
      });
    }
  }
);

export default router;
