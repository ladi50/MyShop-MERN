const router = require("express").Router();

const usersController = require("../controllers/users");
const usersValidator = require("../middlewares/validators/users");

router.post("/login", usersValidator.loginValidator, usersController.login);

router.post("/signup", usersValidator.signupValidator, usersController.signup);

module.exports = router;
