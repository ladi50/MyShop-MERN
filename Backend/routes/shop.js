const router = require("express").Router();

const shopControllers = require("../controllers/shop");
const productsValidator = require("../middlewares/validators/products");
const imageUpload = require("../middlewares/upload/imageUpload");
const verifyToken = require("../middlewares/token/verifyToken");

router.get("/", shopControllers.getProducts);

router.get("/product/:prodId", shopControllers.getProduct);

router.use(verifyToken);

router.get("/user/:userId", shopControllers.getProductsByUserId);

router.post(
  "/user/:userId",
  imageUpload.single("imageUrl"),
  productsValidator.addProductValidator,
  shopControllers.addProduct
);

router.get("/edit-product/:prodId", shopControllers.getProductData);

router.patch(
  "/edit-product/:prodId",
  productsValidator.editProductValidator,
  shopControllers.editProduct
);

router.delete("/product/:prodId", shopControllers.deleteProduct);

router.post("/cart", shopControllers.addToCart);

router.get("/cart", shopControllers.getCart);

router.delete("/cart/:prodId", shopControllers.deleteCartItem);

router.post("/checkout", shopControllers.checkout);

router.post("/order", shopControllers.createOrder);

router.get("/orders/:userId", shopControllers.getOrders);

module.exports = router;
