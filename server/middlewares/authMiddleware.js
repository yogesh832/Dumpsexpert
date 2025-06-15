const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  console.log("Cookies:", req.cookies);  // Add this
  const token = req.cookies.token;
  // Check if token exists

  if (!token) return res.status(401).json({ error: "Access Denied - No Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(400).json({ error: "Invalid Token" });
  }
};
