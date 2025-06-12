const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
