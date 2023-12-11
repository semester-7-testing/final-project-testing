import { body, validationResult } from "express-validator";

export const singupBodyValidationRules = () => {
  return [
    body("name")
      .isAlphanumeric()
      .withMessage("The name should be alphanumeric")
      .isLength({ min: 2, max: 15 })
      .withMessage("The name should be between 2-15 characters long")
      .escape()
      .trim(),
    body("email").isEmail().withMessage("The email is invalid").trim(),
    body("password")
      .isLength({ min: 5, max: 20 })
      .withMessage("The password should be between 5-20 characters long")
      .trim(),
  ];
};

export const loginBodyValidationRules = () => {
  return [
    body("email").isEmail().withMessage("The email is invalid"),
    body("password")
      .isLength({ min: 5, max: 20 })
      .withMessage("The password should be between 5-20 characters long"),
  ];
};

export const createOrderBodyValidationRules = () => {
  return [
    body("deliveryAddress").escape().trim(),
    body("email").isEmail().withMessage("The email is invalid"),
    body("products").isArray().withMessage("The products should be an array"),
  ];
};

export const createProductBodyValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("The name is required"),
    body("price").isNumeric().withMessage("The price should be a number"),
    body("description").notEmpty().withMessage("The description is required"),
    body("imgUrl").notEmpty().withMessage("The img url is required"),
  ];
};

export const createCheckoutBodyValidationRules = () => {
  return [
    body("amount").isNumeric().withMessage("The amount should be a number"),
  ];
};

export const validate = (req, res, next) => {
  const validationsErrors = validationResult(req);
  if (!validationsErrors.isEmpty()) {
    const errors = validationsErrors.array().map((error) => ({
      msg: error.msg,
    }));
    return res.status(400).json({ errors, data: null });
  }

  next();
};
