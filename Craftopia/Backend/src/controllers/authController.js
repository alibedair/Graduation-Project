const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password, role} = req.body;
        
        const existingUser = await User.findOne({where: {email}});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({email, password: hashedPassword, role});
        
        
        return res.status(201).json({
            message: "User registered successfully",
            userId: user.userId,
            email: user.email,
            role: user.role
        });

    }catch(error){
        console.error("Error registering user:", error.message, error.stack);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.login = async (req, res) => {
    try{
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const {email, password} = req.body;
        
        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        
        const token = jwt.sign(
          { id: user.userId, role: user.role },
          process.env.JWT_SECRET, 
          { 
            expiresIn: "1h",
            algorithm: "HS256"
          }
        );
        
        return res.status(200).json({
            token,
            userId: user.userId,
            role: user.role
        });
    }catch(error){
        console.error("Error logging in user:", error.message, error.stack);
        return res.status(500).json({message: "Internal server error"});
    }
}