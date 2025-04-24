const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.user = decoded; // Contains the user id
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

module.exports = verifyUser;
