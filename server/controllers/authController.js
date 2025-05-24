const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

//controller logic for signup
exports.signup = async(req,res) =>{
    try{
        const { email,password } = req.body;
        
        //for checking old user
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(409).json({error: "Email already exists"});

        //for making new user
        const newUser = new User({email, password});
        await newUser.save();

        const token = newUser.generateJWT();
       // Set JWT in cookie
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "User registered successfully",
        user: {
          email: newUser.email,
          role: newUser.role,
        },
      });

    }catch(error){
    res.status(500).json({error: 'Server error during signup'});
    }
};

//controller logic for signin
exports.signin = async(req,res) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(401).json({error: "Invalid credentials"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({error: "Invalid credentials"});

        const token = user.generateJWT();

        // Set JWT in cookie
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        message: "User signed in successfully",
        user: {
          email: user.email,
          role: user.role,
        },
      });
    }catch(error){
         res.status(500).json({ error: "Server error during signin" });
    }
};

//controller logic for logout
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};