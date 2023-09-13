// import hte script of razorpay
// create option object to open the modal

import { toast } from "react-hot-toast";
import{studentEndpoints} from "../apis";
import {apiConnector} from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import {resetCart} from "../../slices/cartSlice";

const {COURSE_PAYMENT_API,COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL}= studentEndpoints;
//require("dotenv").config();

function loadScript(src){
    return new Promise ((resolve)=>{
        const script= document.createElement("script");
        script.src= src;
        script.onload= ()=>{
            resolve(true);
        }
        script.onerror=()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch){
    const toastID= toast.loading("Loading..");
    try{
        // load the script
        const res= await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!res){
            toast.error("RazorPay SDK failed to load");
            return;
        }
        // initialize the order
        const orderResponse= await apiConnector("POST",COURSE_PAYMENT_API,
        {courses},
        {
            "Authorisation": `Bearer ${token}`,
        }
        );
        console.log("order initiate response", orderResponse);
        if (!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }
        // create the options
        const options= {
            key: process.env.RAZORPAY_KEY ,
            currency: orderResponse.data.message.currency,
            amount: orderResponse.data.message.amount,
            order_id: orderResponse.data.message.id ,
            name: "StudyNotion" ,
            description: "Learn and lead the world with StudyNotion" ,
            image: rzpLogo ,
            prefill: {
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: `${userDetails.email}`
            } ,
            handler: function(response){
                // send successful wla mail
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount, token);
                // verify the payment
                verifyPayment({...response,courses},token,navigate,dispatch)
            },
        }

        // payment object dialog box
        const paymentObject= new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed",function(response){
            toast.error("oops, payment failed...");
            //console.log(error.message);
        })

    }catch(error){
        console.log("Payment mein error", error);
        toast.error("Error in the payment")
        /* return res.json({
            success: false,
            message: "Error in buying the course",
            error: error.message,
        }); */
    }
    toast.dismiss(toastID);
}

async function sendPaymentSuccessEmail(response,amount,token){
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            "Authorisation": `Bearer ${token}`,
        })
    }catch(error){
        console.log("error in sending payment success mail", error.message);
        /* return res.json({
            success: false,
            message: "Error in calling send payment success mail",
            error: error.message,
        }) */
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch){
    const toastId= toast.loading("Verifying payment...");
    dispatch(setPaymentLoading(true));
    try{
        const response= await apiConnector("POST", COURSE_VERIFY_API, bodyData,{
            "Authorisation": `Bearer ${token}`,
        })
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Payment Successful, you have been enrolled for the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }catch(error){
        console.log("Error in payment verification", error.message);
        /* return res.json({
            success: false,
            message: "Error in payment verification",
            error: error.message,
        }) */
    }
    toast.dismiss(toastId);
}