import { USERS } from '../../constants';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateTokenForCommonUser = () => {
  const testUserTokenPayload = {
    email: USERS.commonUser.email,
    isAdmin: false,
    id: 'testUserId',
  };

  const tokenSecret = process.env.JWT_SECRET || 'myjwtsecret';

  const tokenExpiry = 1000000;

  try {
    const token = JWT.sign(
      {
        id: testUserTokenPayload.id,
        email: testUserTokenPayload.email,
        isAdmin: testUserTokenPayload.isAdmin,
      },
      tokenSecret,
      {
        expiresIn: tokenExpiry,
      }
    );

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

export { generateTokenForCommonUser };
