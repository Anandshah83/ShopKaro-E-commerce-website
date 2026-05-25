
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const user = require('../models/user.model');

const userSignUp= async ( req , res )=>{
    //code here 
    try{
        const data=req.body;
        if(!data.name || !data.email || !data.password){
            return res.status(400).json({
                    success:false,
                    message:"Invalid Input"
            });
        }
        const hashpassword=await bcrypt.hash(data.password , 10 );
        
        const newUser=await user.create({ ...data , password: hashpassword });
        const userResponse = newUser.toObject();
        delete userResponse.password;
        res.status(201).json({
            success:true,
            message:"New user created successfully",
            data:userResponse
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const userLogIn = async ( req , res )=>{
    //code here 
    try{
        const data = req.body;
        if(!data.email || !data.password){
            return res.status(400).json({
                success:false,
                message:"Invalid Input"
            });
        }
        const userfind=await user.findOne({ email: data.email });
        if(!userfind){
            return res.status(401).json({
                success:false,
                message:"User not find"
            });
        }
        const checkpass=await bcrypt.compare( data.password , userfind.password );
        if(!checkpass){
            return res.status(401).json({
                success:false,
                message:"Wrong Password"
            });
        }
        //generate jwt token
        const token=jwt.sign({ id: userfind._id, role: userfind.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        res.status(200).json({
            success:true,
            message:"token genearated",
            token_no:token,
            user:{
                _id:userfind._id,
                name:userfind.name,
                email:userfind.email,
                role:userfind.role
            }
        });
    }
    catch(error){
        res.status(500).json({
             success: false,
             message: error.message
        });
    }
}

module.exports = { userSignUp , userLogIn };
