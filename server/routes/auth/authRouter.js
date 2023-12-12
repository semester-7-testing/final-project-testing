import { Router } from 'express';
const router = Router();
import bcrypt from 'bcryptjs';
import User from '../../models/user.js';
import { respondWithUser } from '../functions.js';
import { checkAuth, checkAdmin } from '../../middleware/auth.js';
import {
  validate,
  singupBodyValidationRules,
  loginBodyValidationRules,
} from '../../middleware/validation.js';

router.post(
  '/signup',
  singupBodyValidationRules(),
  validate,
  async (req, res) => {
    const { email, password, name } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Email already in use',
          },
        ],
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(process.env.PEPER + password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      isAdmin: false,
    });

    console.log(newUser);

    respondWithUser(res, 201, newUser);
  }
);

router.post(
  '/login',
  loginBodyValidationRules(),
  validate,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log('user', user);

    //if user does not exist in db
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid credentials',
          },
        ],
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(
      process.env.PEPER + password,
      user.password
    );

    console.log('match', isMatch);

    //passwords does not match
    if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid credentials',
          },
        ],
        data: null,
      });
    }

    respondWithUser(res, 200, user);
  }
);

router.get('/me', checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  respondWithUser(res, 200, user);
});

router.get('/deleteUser', checkAuth, checkAdmin, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  await user.remove();
  respondWithUser(res, 200, user);
});

export default router;
