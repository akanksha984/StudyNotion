const jwt= require('jsonwebtoken');
require('dotenv').config();
const User= require('../models/User');

//auth
exports.auth= async(req,res,next)=>{
    try{
        // extract token
        const token= req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ", "");
        // if token is missing
        if (!token){
            return res.status(500).json({
                success: false,
                message: "Token is missing",
            });
        }
        // verify token
        try{
            console.log("got taken as --> ",token)
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log("Decoded->",decode); 
            req.user= decode;
        }catch(error){
            // verification issue
            console.log("Error in token verification");
            return res.status(401).json({
                success: false,
                message: "Error in token verification",
                error: error.message,
            });
        }
        next();
    }catch(error){
        console.log("errror in authentication");
        return res.status(401).json({
            success: false,
            message: "Error in authentication",
            error: error.message,
        })
    }
}

//isStudent
exports.isStudent= async(req,res,next)=>{
    try{
        // auth middleware se req mein role already passed hai
        if (req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "Permission denied! This is protected route for students only",
            })
        }
        next();
        
    }catch(error){
        console.log("ERror in protected route for student");
        return res.status(401).json({
            status: false,
            message: "Error in protected route for student",
            error: error.message,
        })
    }
}
//isInstructor
exports.isInstructor= async(req,res,next)=>{
    try{
        if (req.user.accountType !== "Instructor"){
            return res.json({
                success: false,
                message: "Permission denied! This is protected route for instructor only",
            })
        } 
        next();   
    }catch(error){
        console.log("error in instructor route");
        return res.status(500).json({
            success: false,
            message: "Error in protected route for Instructor",
            error: error.message,
        })
    }
    
}

//isAdmin
exports.isAdmin= async(req,res,next)=>{
    try{
        /* console.log(req.user);
        console.log(req.user.accountType); */
        if (req.user.accountType !== "Admin"){
            return res.json({
                success: false,
                message: "Permission denied! This is protected route for admin only",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in protected route for admin",
            error: error.message,
        })
    }
}
 
