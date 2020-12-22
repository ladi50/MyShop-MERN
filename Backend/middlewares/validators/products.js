const { body, validationResult } = require("express-validator");

const HttpError = require("../../utils/ErrorHandler/errorHandler");

exports.addProductValidator = [
  body("title", "Title is required!").trim().not().isEmpty(),
  body("description", "Description is required!").trim().not().isEmpty(),
  body("imageUrl", "Image is required!").isBase64(),
  body("price", "Price is required!").trim().not().isEmpty(),
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

exports.editProductValidator = [
  body("title", "Title is required!").trim().not().isEmpty(),
  body("description", "Description is required!").trim().not().isEmpty(),
  body("price", "Price is required!").trim().not().isEmpty(),
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
