const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    _id: false,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    category: String,
  }],
  address: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
  },
  totalPrice: { type: Number, default: 0 },
  paymentMethod: { type: String },
  paymentStatus: { type: String, default: "pending" },
  orderStatus: {
    type: String,
    default: "Order Placed",
  },
  statusUpdatedAt: { type: Date, default: Date.now },
  deliveryOTP: { type: String, default: null },
  otpVerified: { type: Boolean, default: false },
  review: {
    rating: { type: Number, default: 0 },
    text: { type: String, default: "" },
    photo: { type: String, default: "" },
    createdAt: { type: Date },
  },
  isCustomCake: { type: Boolean, default: false },
  customDetails: { type: Object, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);