const { body, validationResult } = require("express-validator");

const HttpError = require("../../utils/ErrorHandler/errorHandler");

exports.signupValidator = [
  body("name", "Name is required!").trim().not().isEmpty(),
  body("email", "Invalid email!").isEmail().normalizeEmail().not().isEmpty(),
  body("password", "Password must be at least 6 characters long!")
    .trim()
    .isLength({ min: 6 })
    .not()
    .isEmpty()
    .withMessage("Password must be at least 6 characters long!"),
  (req, res, next) => {
    const errors = validationResult(req);

    let errorList = [];

    if (!errors.isEmpty()) {
      for (error of errors.array()) {
        errorList.push(error.msg);
        errorList = [...new Set(errorList)];
      }
      error = new Error(errorList, 422);
      return next(error);
    }

    next();
  }
];

exports.loginValidator = [
  body("email", "Invalid email!").isEmail().normalizeEmail().not().isEmpty(),
  body("password", "Password must be at least 6 characters long!")
    .trim()
    .isLength({ min: 6 })
    .not()
    .isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    let errorList = [];

    if (!errors.isEmpty()) {
      for (error of errors.array()) {
        errorList.push(error.msg);
        errorList = [...new Set(errorList)];
      }
      error = new HttpError(errorList, 422);
      return next(error);
    }

    next();
  }
];
