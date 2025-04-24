const jwt = require("jsonwebtoken");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: "Token is invalid" });
  }
  try {
    const tokendecode = jwt.verify(token, process.env.jwt_secret);
    // console.log(token);

    // Ensure req.body exists
    if (!req.body) req.body = {};

    if (tokendecode.id) {
      req.body.userId = tokendecode.id;
      //   console.log("userIdddddddddddddddddddddd", req.body.userId);
      //   console.log("tokendecode.iddddddddddddddd", tokendecode.id);
    } else {
      return res.json({
        success: false,
        message: "Authentication failed, Login Again",
      });
    }

    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

module.exports = userAuth;
