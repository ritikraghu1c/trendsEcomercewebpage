const addToCartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId;

        // ✅ If "all" flag is true, delete all products of this user
        if (req.body.all) {
            await addToCartModel.deleteMany({ userId: currentUserId });

            return res.json({
                message: "All products deleted from cart",
                error: false,
                success: true,
            });
        }

        // ✅ Otherwise delete single product by _id
        const addToCartProductId = req.body._id;

        const deleteProduct = await addToCartModel.deleteOne({
            _id: addToCartProductId,
            userId: currentUserId,
        });

        res.json({
            message: "Product deleted from cart",
            error: false,
            success: true,
            data: deleteProduct,
        });
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = deleteAddToCartProduct;
