import { body, validationResult } from "express-validator";

export const singupBodyValidationRules = () => {
  return [
    body("name")
      .trim()
      .isAlphanumeric()
      .withMessage("The name should be alphanumeric")
      .isLength({ min: 2, max: 15 })
      .withMessage("The name should be between 2-15 characters long")
      .escape(),
    body("email").trim().isEmail().withMessage("The email is invalid"),
    body("password")
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage("The password should be between 5-20 characters long"),
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
    body("deliveryAddress").trim().isLength({ min: 5 }).escape(),
    body("email").isEmail().withMessage("The email is invalid"),
    body("products")
      .notEmpty()
      .isArray()
      .withMessage("The products should be an array"),
  ];
};

export const createProductBodyValidationRules = () => {
  const minPrice = 40;
  return [
    body("name").isLength({ min: 2 }).withMessage("The name is required"),
    body("price")
      .isNumeric()
      .withMessage("The price should be a number")
      .custom((value) => {
        if (value < minPrice) {
          throw new Error(
            `The price should be more than or equal to ${minPrice}`
          );
        }
        return true;
      }),
    body("description").notEmpty().withMessage("The description is required"),
    body("imgUrl").notEmpty().withMessage("The img url is required"),
  ];
};

export const createCheckoutBodyValidationRules = () => {
  const minAmount = 40;
  return [
    body("amount")
      .isNumeric()
      .withMessage("The amount should be a number")
      .custom((value) => {
        if (value < minAmount) {
          throw new Error(
            `The amount should be more than or equal to ${minAmount}`
          );
        }
        return true;
      }),
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

export const validateQueryParams = (req, res, next) => {
  const { page, limit, priceOrder } = req.query;
  
  let error;
  if (page && (isNaN(page) || page < 1)) error = "page must be a positive number greater than 0";
  else if (limit && (isNaN(limit) || limit < 0)) error = "limit must be a positive number greater than or equal to 0";
  else if (priceOrder && !["ASC", "DESC"].includes(priceOrder)) error = "priceOrder must be ASC or DESC (case sensitive)";
  
  if (error) {
    return res.status(400).json({ error, data: null });
  }
  
  next();
};
