const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        required: true
      }
    ]
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;