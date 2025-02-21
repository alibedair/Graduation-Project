const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    try{

        const {email, password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({message: "Please fill all fields"});
        }
        const existingUser = await User.findOne({where: {email}});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({email, password: hashedPassword, role});
        return res.status(201).json({user});

    }catch(error){
        console.error("Error registering user:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please fill all fields"});
        }
        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const token = jwt.sign({id: user.userId}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({token});
    }catch(error){
        console.error("Error logging in user:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}