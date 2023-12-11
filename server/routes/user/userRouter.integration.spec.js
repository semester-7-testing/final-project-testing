import request from 'supertest';
import dotenv from 'dotenv';
import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../../models/user.js';
import Product from '../../models/product.js';
import Order from '../../models/order.js';

dotenv.config();

describe('User Router', () => {
  const user = {
    name: 'testName',
    email: 'testEmail2345',
    password: 'testPassword',
    isAdmin: true,
  };

  const product = {
    name: 'The best nike shoes',
    description: 'You need to buy them!',
    price: 1,
    imgUrl: 'test://test.sk',
  };

  const testUserId = 'testUserId';

  let userDoc, productDoc, orderDoc;

  beforeAll(() => {
    mongoose
      .set('strictQuery', true) // remove a mongoose warning
      .connect(process.env.MONGO_URI);
  });

  async function seedDb() {
    userDoc = new User(user);
    await userDoc.save();

    productDoc = new Product(product);
    await productDoc.save();

    const order = {
      userId: testUserId,
      products: [{ productId: productDoc._id, quantity: 1 }],
      deliveryAddress: 'testAddress',
      status: 'testStatus',
      email: userDoc.email,
    };

    orderDoc = await new Order(order);
    await orderDoc.save();

    const testIfUserAdded = await User.find({ email: user.email });
    console.log('test if user was added', testIfUserAdded);

    const testIfProductAdded = await Product.find({ name: product.name });
    console.log('test if product was added', testIfProductAdded);

    const testIfOrderAdded = await Order.find({ userId: testUserId });
    console.log('test if order was added', testIfOrderAdded);
  }

  beforeEach(async () => {
    await seedDb();
  });

  afterEach(async () => {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /:userId/orders', () => {
    it('should return 401 if req.params.userId !== req.user.id', async () => {
      const invalidUserId = '456';

      const testUserTokenPayload = {
        email: 'test@test.sk',
        isAdmin: true,
        id: '123',
      };

      const token = JWT.sign(testUserTokenPayload, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .get(`/api/users/${invalidUserId}/orders`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(401);
    });

    it('should return all user orders', async () => {
      const testUserTokenPayload = {
        email: user.email,
        isAdmin: user.isAdmin,
        id: testUserId,
      };

      const token = JWT.sign(testUserTokenPayload, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const response = await request(
        `http://localhost:${process.env.SERVER_PORT}`
      )
        .get(`/api/users/testUserId/orders`)
        .set('Authorization', `Bearer ${token}`);

      console.log(await response.body.data);
      expect(response.statusCode).toBe(200);
    });
  });
});
