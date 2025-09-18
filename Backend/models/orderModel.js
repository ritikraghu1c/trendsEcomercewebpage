const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  cartItems: [
    {
      name: String,
      qty: Number,
      price: Number,
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      }
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    pincode: String
  },
  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: String,

    method: String, // 'card', 'upi', 'netbanking', 'wallet', etc.

    cardInfo: {   // Only if method is 'card'
      last4: String,
      network: String,
      issuer: String,
      type: String
    },

    vpa: String,   // Only if method is 'upi'
    bank: String,  // Only if method is 'netbanking'
    wallet: String // Only if method is 'wallet'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing"
  }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
