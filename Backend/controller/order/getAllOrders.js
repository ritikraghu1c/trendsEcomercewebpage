const orderModel = require("../../models/orderModel");

const getAllOrders = async (req, res) => {
  try {
    // Check admin authorization
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
        error: true
      });
    }

    // Fetch orders with user info populated
    const orders = await orderModel
      .find()
      .populate("user", "name email role") // populate user info
       .populate("cartItems.product") // ✅ populate product details
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "All Orders Fetched",
      error: false,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
      error: true
    });
  }
};

module.exports = getAllOrders;
