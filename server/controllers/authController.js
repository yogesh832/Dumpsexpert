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
        res.status(201).json({
      message: "User registered successfully",
      token,
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

        res.status(200).json({ token, user: { email: user.email, role: user.role } });
    }catch(error){
         res.status(500).json({ error: "Server error during signin" });
    }
};