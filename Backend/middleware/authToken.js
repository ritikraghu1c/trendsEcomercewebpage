const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel'); // adjust the path if needed

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please Login...!",
        error: true,
        success: false
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async function (err, decoded) {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
          error: true,
          success: false
        });
      }

      // ✅ Fetch full user to access role and other details
      const user = await userModel.findById(decoded._id).select('-password');
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          error: true,
          success: false
        });
      }

      req.user = user;           // Full user object with `role`
      req.userId = user._id;     // For backward compatibility
      next();
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = authToken;
