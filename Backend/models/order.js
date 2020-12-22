const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "Product"
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
