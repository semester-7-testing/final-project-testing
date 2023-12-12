import { Router } from 'express';
import Order from '../../models/order.js';
import Product from '../../models/product.js';
import { checkAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/:userId/orders', checkAuth, async (req, res) => {
  try {
    if (req.params.userId !== req.user.id) {
      return res.status(401).json({
        errors: [
          {
            msg: 'Unauthorized',
          },
        ],
        data: null,
      });
    }

    res.status(200).json({
      errors: [],
      data: {
        orders: await getAllUsersOrders(req.params.userId),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errors: [],
      data: null,
    });
  }
});

const getAllUsersOrders = async (userId) => {
  let orders = await Order.find({ userId });
  if (orders.length === 0) return orders;
  const promises = orders.map(async (order) => {
    const promises = order.products.map(async ({ productId, quantity }) => {
      const { name, imgUrl, price, description } = await Product.findById(
        productId
      );
      return {
        productId,
        quantity,
        name,
        imgUrl,
        price,
        description,
      };
    });
    return await Promise.all(promises);
  });
  return await Promise.all(promises);
};

export default router;
