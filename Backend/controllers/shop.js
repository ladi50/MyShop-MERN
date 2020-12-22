const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { LocalStorage } = require("node-localstorage");

const Product = require("../models/product");
const User = require("../models/user");
const Cart = require("../models/cart");
const Order = require("../models/order");
const HttpError = require("../utils/ErrorHandler/errorHandler");

if (typeof localStorage === "undefined" || localStorage === null) {
  localStorage = new LocalStorage(
    path.join(__dirname, "..", "utils", "localStorage")
  );
}

exports.getProducts = async (req, res, next) => {
  let foundProducts;

  try {
    foundProducts = await Product.find({}).sort({ createdAt: -1 });
  } catch (err) {
    const error = new HttpError("Products not found!", 404);
    return next(error);
  }

  if (!foundProducts) {
    const error = new HttpError("Products not found!", 404);
    return next(error);
  }

  res.status(200).json({ products: foundProducts });
};

exports.getProductsByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let foundProducts;

  try {
    foundProducts = await Product.find({ creator: userId }).sort({
      updatedAt: -1
    });
  } catch (err) {
    const error = new HttpError("Products not found!", 404);
    return next(error);
  }

  if (!foundProducts) {
    const error = new HttpError("Products not found!", 404);
    return next(error);
  }

  res.status(200).json({ products: foundProducts });
};

exports.getProduct = async (req, res, next) => {
  const { prodId } = req.params;

  let foundProduct;

  try {
    foundProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  if (!foundProduct) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  res.status(200).json({ product: foundProduct });
};

exports.addProduct = async (req, res, next) => {
  const { title, description, price } = req.body;
  const imageUrl = req.file.filename;
  const { userId } = req.userData;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.filename,
    Body: fs.createReadStream(req.file.path),
    ACL: "public-read",
    ContentType: req.file.mimetype
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
    } else if (data) {
      console.log("Image uploaded to AWS S3!");
    }
  });

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("User not found!", 404);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("User not found!", 404);
    return next(error);
  }

  const product = new Product({
    title,
    description,
    imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageUrl}`,
    price,
    creator: userId
  });

  let savedProduct;

  try {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        throw new Error(err);
      }
    });

    foundUser.products.push(product._id);
    await foundUser.save();
    savedProduct = await product.save();
  } catch (err) {
    const error = new HttpError("Could not save product!", 500);
    return next(error);
  }

  if (!savedProduct) {
    const error = new HttpError("Could not save product!", 500);
    return next(error);
  }

  res.status(201).json({ message: "Product created!", product: savedProduct });
};

exports.getProductData = async (req, res, next) => {
  const { prodId } = req.params;
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  let foundProduct;

  try {
    foundProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  if (!foundProduct) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  res.status(200).json({ product: foundProduct });
};

exports.editProduct = async (req, res, next) => {
  const { title, description, price } = req.body;
  const { prodId } = req.params;

  let foundProduct;

  try {
    foundProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  if (!foundProduct) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  foundProduct.title = title;
  foundProduct.description = description;
  foundProduct.price = price;

  let savedProduct;

  try {
    savedProduct = await foundProduct.save();
  } catch (err) {
    const error = new HttpError("Could not save product!", 500);
    return next(error);
  }

  if (!savedProduct) {
    const error = new HttpError("Could not save product!", 500);
    return next(error);
  }

  res.status(200).json({ message: "Product updated!", product: savedProduct });
};

exports.deleteProduct = async (req, res, next) => {
  const { prodId } = req.params;
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Reaching database failed!", 500);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("User not found!", 404);
    return next(error);
  }

  let foundProduct;

  try {
    foundProduct = await Product.findById(prodId);
  } catch (err) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  if (!foundProduct) {
    const error = new HttpError("Product not found!", 404);
    return next(error);
  }

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: foundProduct.imageUrl.split("com/")[1]
  };

  try {
    s3.deleteObject(params, (err, data) => {
      if (err) {
        throw new Error(err);
      }
      if (data) {
        console.log("Product image deleted from AWS S3.");
      }
    });

    foundUser.products = foundUser.products.filter(
      (product) => product.toString() !== prodId
    );
    await foundUser.save();

    foundProduct.remove();
  } catch (err) {
    const error = new HttpError("Could not delete product!", 500);
    return next(error);
  }

  res.status(200).json({ message: "Product deleted!" });
};

exports.addToCart = async (req, res, next) => {
  const { productId } = req.body;
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  let quantity = 1;
  let foundCart;

  try {
    foundCart = await Cart.findOne({ productId, user: userId });
  } catch (err) {
    const error = new HttpError(
      "There has been a problem with getting into our database!",
      500
    );
    return next(error);
  }

  let cart;

  if (foundCart) {
    quantity = quantity + foundCart.quantity;
    foundCart.quantity = quantity;
  } else {
    cart = new Cart({ productId, user: userId, quantity: 1 });
  }

  let savedCart;

  try {
    savedCart = foundCart ? await foundCart.save() : await cart.save();
  } catch (err) {
    const error = new HttpError("Could not save cart!", 500);
    return next(error);
  }

  if (!savedCart) {
    const error = new HttpError("Could not save cart!", 500);
    return next(error);
  }

  res.status(201).json({ message: "Cart saved!", cart: savedCart });
};

exports.getCart = async (req, res, next) => {
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  let foundCart;

  try {
    foundCart = await Cart.find({ user: userId }).populate("productId").exec();
  } catch (err) {
    const error = new HttpError("Cart not found!", 404);
    return next(error);
  }

  if (!foundCart) {
    const error = new HttpError("Cart not found!", 404);
    return next(error);
  }

  res.status(200).json({ cart: foundCart });
};

exports.deleteCartItem = async (req, res, next) => {
  const { prodId } = req.params;
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  let foundCartItem;

  try {
    foundCartItem = await Cart.findOne({ productId: prodId, user: userId });
  } catch (err) {
    const error = new HttpError("Product not found inside cart!", 404);
    return next(error);
  }

  if (!foundCartItem) {
    const error = new HttpError("Product not found inside cart!", 404);
    return next(error);
  }

  try {
    foundCartItem.remove();
  } catch (err) {
    const error = new HttpError("Could not remove product from cart!", 500);
    return next(error);
  }

  res.status(200).json({ message: "Product removed from cart!" });
};

exports.checkout = async (req, res, next) => {
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  let foundCartItems;

  try {
    foundCartItems = await Cart.find({ user: userId })
      .populate("productId")
      .exec();
  } catch (err) {
    const error = new HttpError("Could not find card items!", 404);
    return next(error);
  }

  if (!foundCartItems) {
    const error = new HttpError("Could not find cart items!", 404);
    return next(error);
  }

  let products = [];

  foundCartItems.map((cartItem) => {
    return products.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: cartItem.productId.title,
          images: [cartItem.productId.imageUrl]
        },
        unit_amount: cartItem.productId.price * 100
      },
      quantity: cartItem.quantity
    });
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: products,
    mode: "payment",
    success_url: "http://localhost:3000/checkout",
    cancel_url: "http://localhost:3000/cart"
  });

  localStorage.setItem("stripeSession", session.id);

  res.json({ id: session.id });
};

exports.createOrder = async (req, res, next) => {
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  const stripeSession = localStorage.getItem("stripeSession");

  if (!stripeSession) {
    const error = new HttpError(
      "Please checkout from your cart in order to procceed!",
      403
    );
    return next(error);
  }

  const session = await stripe.checkout.sessions.retrieve(stripeSession);

  if (!session || session.payment_status !== "paid") {
    const error = new HttpError(
      "Please checkout from your cart in order to procceed!",
      403
    );
    return next(error);
  }

  let foundCartItems;

  try {
    foundCartItems = await Cart.find({ user: userId });
  } catch (err) {
    const error = new HttpError("Could not find card items!", 404);
    return next(error);
  }

  if (!foundCartItems || foundCartItems.length === 0) {
    const error = new HttpError("Could not find cart items!", 404);
    return next(error);
  }

  const orderProducts = foundCartItems.map((cartItem) => {
    return {
      productId: cartItem.productId,
      quantity: cartItem.quantity
    };
  });

  const order = new Order({
    products: orderProducts,
    user: userId
  });

  let createdOrder;

  try {
    createdOrder = await order.save();
    await Cart.remove({ user: userId });
  } catch (err) {
    const error = new HttpError("Could not create order and clear cart!", 500);
    return next(error);
  }

  if (!createdOrder) {
    const error = new HttpError("Could not create order!", 500);
    return next(error);
  } else {
    localStorage.removeItem("stripeSession");
  }

  res.status(201).json({ message: "Order created!", order: createdOrder });
};

exports.getOrders = async (req, res, next) => {
  const { userId } = req.userData;

  let foundUser;

  try {
    foundUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  if (!foundUser) {
    const error = new HttpError("Not authenticated!", 401);
    return next(error);
  }

  let foundOrders;

  try {
    foundOrders = await Order.find({ user: userId })
      .populate("products.productId")
      .exec();
  } catch (err) {
    const error = new HttpError("Could not find orders!", 500);
    return next(error);
  }

  if (!foundOrders) {
    const error = new HttpError("Orders not found!", 404);
    return next(error);
  }

  res.status(200).json({ orders: foundOrders });
};
