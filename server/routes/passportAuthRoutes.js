const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "User authentication failed" });
      }
      const token = req.user.generateJWT();

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "Authentication successful",
          user: { email: req.user.email, role: req.user.role },
        });
    } catch (error) {
      res.status(500).json({
        error: "Server error during Google Login",
      });
    }
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  async (req, res) => {
    try {
      const token = req.user.generateJWT();
      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "Authentication successful",
          user: { email: req.user.email, role: req.user.role },
        });
    } catch (error) {
      res.status(500).json({
        error: "Server error during Facebook Login",
      });
    }
  }
);

module.exports = router;
