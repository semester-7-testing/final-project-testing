import { Router } from "express";
import Stripe from "stripe";
import {
  createCheckoutBodyValidationRules,
  validate,
} from "../../middleware/validation.js";

const router = Router();

router.post(
  "/",
  createCheckoutBodyValidationRules(),
  validate,
  async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "eur",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      errors: [],
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  }
);

export default router;
