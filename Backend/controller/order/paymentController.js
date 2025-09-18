const Razorpay = require('razorpay');
const crypto = require('crypto');
const OrderModel = require('../../models/orderModel');
const axios = require('axios');

// ✅ Create Razorpay Order
const createOrder = async (req, res) => {
    try {
        const { amount, receipt } = req.body;

        if (!amount || !receipt) {
            return res.status(400).json({ message: 'Amount and receipt are required' });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: 'Failed to create order' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('❌ Error in creating order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ✅ Verify Razorpay Payment & Save Order
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      shippingAddress,
      totalAmount
    } = req.body;

    // Step 1: Verify Razorpay signature
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Payment validation failed" });
    }

    // Step 2: Fetch payment details from Razorpay
    const razorpayResponse = await axios.get(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET
        }
      }
    );

    const paymentDetails = razorpayResponse.data;

    // Step 3: Extract method-specific info
    let methodDetails = {};
    if (paymentDetails.method === 'card') {
      methodDetails.cardInfo = {
        last4: paymentDetails.card.last4,
        network: paymentDetails.card.network,
        issuer: paymentDetails.card.issuer,
        type: paymentDetails.card.type,
      };
    } else if (paymentDetails.method === 'upi') {
      methodDetails.vpa = paymentDetails.vpa;
    } else if (paymentDetails.method === 'netbanking') {
      methodDetails.bank = paymentDetails.bank;
    } else if (paymentDetails.method === 'wallet') {
      methodDetails.wallet = paymentDetails.wallet;
    }

    // Debug log (optional)
    console.log("🧾 Payment method details:", {
      method: paymentDetails.method,
      ...methodDetails
    });

    // Step 4: Save order with method info
    const newOrder = new OrderModel({
      user: req.user._id,
      cartItems: cartItems || [],
      shippingAddress: shippingAddress || {},
      payment: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "Paid",
        method: paymentDetails.method,
        cardInfo: methodDetails.cardInfo || null,
        vpa: methodDetails.vpa || null,
        bank: methodDetails.bank || null,
        wallet: methodDetails.wallet || null
      },
      totalPrice: totalAmount || 0,
      status: "Processing"
    });

    await newOrder.save();

    return res.status(200).json({
      message: "Payment verified and order saved",
      orderId: newOrder._id,
      paymentMethod: paymentDetails.method
    });

  } catch (error) {
    console.error("❌ Error in verifying payment:", error.response?.data || error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get user orders
// ✅ Get user orders with product images populated
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await OrderModel.find({ user: userId })
      .populate('cartItems.product') // ⭐ This enables image access
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error in getUserOrders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
    createOrder,
    verifyPayment,
    getUserOrders
};
