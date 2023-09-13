const mongoose= require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate= require("../mailTemplates/emailVerificationTemplate");

const otpSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp:{
        type:String,
        required: true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires: 5*60, // document will be deleted automatically after 5 mins of creation
    }
});


// function to send otp mail
async function sendVerificationMail(email,otp){
    try{
        const mailResponse= await mailSender(email,"Verification Email from StudyNotion", otpTemplate(otp));
        console.log("Email send successfully! ",mailResponse);
    }catch(error){
        console.log("Error in sending otp: ",error.message);
        throw error;
    }
}
// pre save middleware
otpSchema.pre("save",async function(next){
    if (this.isNew){
        await sendVerificationMail(this.email,this.otp);
    }
    next();
})


module.exports= mongoose.model("Otp",otpSchema);