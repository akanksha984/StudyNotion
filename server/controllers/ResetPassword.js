 const User= require("../models/User");
 const mailSender= require('../utils/mailSender');
 const bcrypt= require('bcrypt'); 
 const crypto= require('crypto');

 // resetPassword Token
 exports.resetPasswordToken = async(req,res)=>{
    try{
        // get the email
        const email= req.body.email;
        // vaildatae the email and check the existence
        if (!email){
            return res.json({
                success: false,
                message: "Please enter the email id",
            })
        }
        const user= await User.findOne({email});
        if (!user){
            return res.json({
                success: false,
                message:`Your email ${email} is not registered with us`
            })
        }
        // generate token
        const token= crypto.randomBytes(20).toString("hex");
        // update the user by addign token and expiration time
        const updatedDetails= await User.findOneAndUpdate({email:email},{
            token: token,
            resetPasswordExpires: Date.now() + 5*60*1000,
        },{new:true});
        //console.log("SEnt token to updated user: ",updatedDetails)
        // create url
        const url= `http://localhost:3000/update-password/${token}`;  
        console.log("Password reset token link:",url);  
        // frontend at port 3000, frontend at 4000
        // send mail containing the url 
        await mailSender(email,"Password Reset Link",
            `You can reset your password at ${url} . Do not share with anyone else.It will expire in 5mins.`
        )
        //return res
        return res.json({
            success: true,
            message: "Password reset link sent successfully. Please check your email to reset your password."
        })
    }catch(error){
        console.log(error.message);
        console.log("Error in sending reset link");
        return res.json({
            success: false,
            message: " Error in password reset link generation",
            error: error.message,
        })
    }
 }

 // reset password in db
exports.resetPassword= async(req,res)=>{
    try{
        // fetch the data
        const {password,confirmPassword,token} = req.body;
        // validation
        if (!password || !confirmPassword){
            return res.json({
                success: false,
                message: "Please enter all the details"
            })
        }
        if (password!== confirmPassword){
            return res.json({
                success: false,
                message: "Confirm password do not match with password",
            })
        }
        // get userdetails from db using token
        //console.log("got token= ",token)
        const userDetails = await User.findOne({token: token});
        // if no entry invalid token
        if (!userDetails){
            return res.json({
                success: false,
                message:"Invalid token",
            });
        }
        // token time check
        if (userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                message: "Link Expired! Try resending it",
            })
        }
        // hash password
        const newHashedPassword= await bcrypt.hash(password,10);
        // password update
        const updated= await User.findOneAndUpdate({token:token},{
            password: newHashedPassword,
        },{new: true});
        console.log("USER updated: ", updated)
        // return res
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        })
    }catch(error){
        console.log(error);
        return res.json({
            success: false,
            message: "Error in password reset",
            error: error.message,
        })
    }
}
