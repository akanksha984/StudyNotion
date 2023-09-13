const User= require("../models/User");
const OTP= require("../models/Otp");
const otpGenerator= require("otp-generator");
const bcrypt= require('bcrypt');
const Profile= require("../models/Profile");
const jwt= require('jsonwebtoken');
require('dotenv').config();
const mailSender = require('../utils/mailSender');
const {passwordUpdated}= require("../mailTemplates/passworsUpdate");


// send OTP
exports.sendOTP= async(req,res)=>{
    try{
        //console.log("got mail id->");
        // fetch the email from request ki body
        const {email}= req.body;
        //console.log(email);
        // check if user already exists
        const checkUserPresent= await User.findOne({email});
        // if user is already registered
        if (checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User already registered!"
            })
        }
        // generate otp
        //console.log("going to gneerate otp");
        var otp= otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("OTP GENERATED:->",otp);
        // check for uniqueness of the otp
        const result= await OTP.findOne({otp:otp});
        while (result){
            otp= otpGenerator.generate(6,{
                upperCaseAlphabets: true,
                lowerCaseAlphabets:true,
                specialChars: false,
            });
            result= await OTP.findOne({otp:otp});
        }

        const otpPayload= {email,otp};
        // create an entry for otp
        const otpBody=await OTP.create(otpPayload);
        console.log("otpBody: ",otpBody);
        // return successful response
        res.status(200).json({
            success: true,
            message: "OTP Sent Sucessfully",
            otp,
        })

    }catch(error){
        console.log("Error in otp generation");
        console.log(error.message);
        return res.status(200).json({
            success:false,
            message: "Error occured in otp generation!",
            error: error.message,
        })
    }
}


// signup
exports.signup= async(req,res)=>{
    try{
        // fethc data from request body
        //console.log("signupRoute");
        const {firstName,lastName,email,password,confirmPassword,accountType,otp}= req.body;
        // validate karo if the data is present
        //console.log("got data for signup",firstName,lastName,email,password,confirmPassword,otp);
        if (!firstName || !lastName || !email || !confirmPassword || !password || !otp){
            return res.status(403).json({
                success: false,
                message: "All the fields are required",
            })
        }
        // match password and confirm password
        if (confirmPassword!==password){
            return res.json({
                success: false,
                message: "Confirm password does not match with password, Try Again!",
            })
        }
        // check if user already exists
        const existingUser= await User.findOne({email:email});
        if (existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists! Please signin to continue"
            })
        }
        // find most recent otp
        const recentOTP= await OTP.find({email}).sort({createdAt:-1}).limit(1); 
        console.log("recent otp: ",recentOTP);
        // validate the otp
        if (recentOTP.length === 0){
            // otp not found
            return res.status(400).json({
                success: false,
                message: "otp expired! generate new"
            })
        }
        if (otp!==recentOTP[0].otp){
            // invalid otp
            return res.status(400).json({
                success:false,
                message: "Invalid otp! Input valid otp"
            })
        }

        // hash password
        const hashedPassword= await bcrypt.hash(password,10);
        let approved="";
        accountType==="Instructor"?(approved=false):(approved=true);
        // create entry in the database
        const profileDetails= await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });
        const user= await User.create({
            firstName,lastName,
            email,
            password:hashedPassword,
            //contactNumber,
            accountType,
            approved,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        //return res
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    }catch(error){
        console.log("error in signup!");
        return res.json({
            success: false,
            message: "Error in SignUp! Try again",
            error: error.message,
        })
    }
}

// login
exports.login= async(req,res)=>{
    try{
        // get data from request body
        const {email,password}= req.body;
        //validate data
        if (!email || !password){
            return res.status(403).json({
                sucess: false,
                message: "Please fill all the fields"
            });
        }
        // check user exists or not
        const existingUser= await User.findOne({email}).populate("additionalDetails");
        if (!existingUser){
            return res.status(401).json({
                success: false,
                message: "User not registered. Please register first"
            })
        }
        // match the password
        if (await bcrypt.compare(password,existingUser.password)){
            // generates JWT
            const payload= {
                email: existingUser.email,
                id: existingUser._id,
                accountType: existingUser.accountType,
            }
            console.log("existing user ",existingUser);
            console.log("payload -> ",payload);
            const token= await jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "4h",
            });
            existingUser.token= token;
            existingUser.password= undefined;
            // create cookie and send response
            const options= {
                expiresIn: new Date(Date.now()+3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token",token,options).status(200).json({
                success: true,
                token,
                user: existingUser,
                message: "Logged in successfully",
            });
        }else{
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

    }catch(error){
        console.log("error in login");
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "error in login, Please try again",
            error: error.message,
        })
    }
}

// changePassword
exports.changePassword= async(req,res)=>{
    try{
        // get data from the req body
        const userDetails= await User.findById(req.user.id);
        const {oldPassword,newPassword,confirmPassword}= req.body;
        // validation
        if (!(await bcrypt.compare(oldPassword,userDetails.password))){
            return res.status(401).json({
                success: false,
                message: "The password you entered is incorrect."
            })
        }
        if (newPassword!==confirmPassword){
            return res.json({
                success: false,
                message: "New paddword does not match with confirm password",
            });
        }
        // update password in db
        const encryptedPass= await bcrypt.hash(newPassword,10) ;
        const updatedUser= await User.findByIdAndUpdate(req.user.id,
        {password: encryptedPass},
        {new:true},
            )
        // send mail-> password updated
        try{
            const emailResponse= await mailSender(updatedUser.email,
                passwordUpdated(updatedUser.email,`Password changed successfully at Studynotion ${updatedUser.firstName} ${updatedUser.lastName}`));
        }catch(error){
            return res.status(500).json({
                success: false,
                message: "Error in sending mail",
                error: error.message,
            })
        }
        // return response 
        return res.status(200).json({
            success: false,
            message: "Successfully updated the password",
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in updatign the password",
            error: error.message,
        })
    }
}
