import JWT from "jsonwebtoken";
import User from "../models/user.js";

export const respondWithUser = async (
  res,
  status,
  user,
  tokenExpirecy = 1000000
) => {
  const token = JWT.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: tokenExpirecy,
    }
  );
  res.status(status).json({
    errors: [],
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        token,
        isAdmin: user.isAdmin,
      },
    },
  });
};

export const resolveAndMapUserName = async (obj) => {
  const { name } = await User.findById(obj.userId);
  return { ...obj, userName: name };
};

export const resolveAndMapUserNameFromQuery = async (obj) => {
  const { name } = await User.findById(obj.userId);
  return { ...obj._doc, userName: name };
};

export const resolveAndMapUserNamesFromQuery = async (array) => {
  if (array.length === 0) return array;
  const promises = array.map(async (item, index) => {
    const { name } = await User.findById(item.userId);
    return { ...item._doc, userName: name };
  });
  return await Promise.all(promises);
};
