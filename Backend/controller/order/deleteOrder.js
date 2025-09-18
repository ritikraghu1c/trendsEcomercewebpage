const OrderModel = require("../../models/orderModel");

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.userId; // from authToken middleware

    const order = await OrderModel.findOneAndDelete({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

module.exports = deleteOrder;
