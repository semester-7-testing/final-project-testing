import { Router } from "express";
import Product from "../../models/product.js";
import { checkAuth, checkAdmin } from "../../middleware/auth.js";
import escapeRegExp from "lodash/escapeRegExp.js";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       [Products]
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       '201':
 *         description: Product created
 *
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", checkAuth, checkAdmin, async (req, res) => {
  await Product.create(req.body);

  res.status(201).json({
    errors: [],
    data: null,
  });
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       [Products]
 *     summary: Get a products list
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: The name to filter by
 *       - in: query
 *         name: priceOrder
 *         schema:
 *           type: string
 *         description: The price order to sort by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of records to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number. Page size is specified in the limit parameter and page count starts from 1
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                      type: integer
 *                     products:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/Product'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", async (req, res) => {
  let { page, limit, priceOrder, searchText } = req.query;

  const query = Product.find();
  if (searchText && searchText !== "") {
    const regex = new RegExp(escapeRegExp(searchText));
    query.where("name").equals({ $regex: regex, $options: "i" });
  }
  if (priceOrder && priceOrder !== "") {
    switch (priceOrder) {
      case "ASC":
        query.sort({ price: 1 });
        break;
      case "DESC":
        query.sort({ price: -1 });
        break;
    }
  }
  const totalCount = (await query.exec())?.length;
  const products = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .clone();

  res.status(200).json({
    errors: [],
    data: {
      products,
      totalCount,
    },
  });
});

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       [Products]
 *     summary: Get a product by ID
 *     parameters:
 *       - name: productId
 *         in: path
 *         description: ID of the product to get
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Product not found
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({
        errors: [
          {
            msg: "Product not found",
          },
        ],
        data: null,
      });
    }
    res.status(200).json({
      errors: [],
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(404).json({
      errors: [
        {
          msg: "Product not found",
        },
      ],
      data: null,
    });
  }
});

export default router;
