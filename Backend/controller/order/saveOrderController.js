const Order = require('../../models/orderModel');

const saveOrderController = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentInfo, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentInfo,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order saving error:", err);
    res.status(500).json({ message: "Failed to save order" });
  }
};

module.exports = saveOrderController;
