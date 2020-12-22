const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const HttpError = require("../utils/ErrorHandler/errorHandler");

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    foundUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("There has been a problem reaching our database!", 500);
    return next(error);
  }

  if (foundUser) {
    const error = new HttpError("Email already exists!", 422);
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = bcrypt.hashSync(password, 12);
  } catch (err) {
    const error = new HttpError(
      "There has been a problem with your password! Please try again."
    );
    next(error);
  }

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  let savedUser;

  try {
    savedUser = await user.save();
  } catch (err) {
    const error = new HttpError("Signup failed! Please try again.");
    return next(error);
  }

  if (!savedUser) {
    const error = new HttpError("Invalid credentials!", 422);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Could not create user!", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Signed up successfully!",
    userId: savedUser._id.toString(),
    email: savedUser.email,
    name: savedUser.name,
    token
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundUser;

  try {
    foundUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("There has been a problem reaching our database!", 500);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("User not found!", 422);
    return next(error);
  }
  
  let compredPasswords;

  try {
    compredPasswords = await bcrypt.compare(password, foundUser.password);
  } catch (err) {
    const error = new HttpError("Invalid credentials!", 422);
    return next(error);
  }

  if (!compredPasswords) {
    const error = new HttpError("Invalid credentials!", 422);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      {
        userId: foundUser._id.toString(),
        name: foundUser.name,
        email: foundUser.email
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Log in failed!", 422);
    return next(error);
  }

  res
    .status(200)
    .json({
      message: "Logged in successfully!",
      userId: foundUser._id.toString(),
      email: foundUser.email,
      name: foundUser.name,
      token
    });
};
