const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
