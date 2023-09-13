const User= require("../models/User");
const Course= require("../models/Course");
const CourseProgress= require("../models/CourseProgress")
const {instance}= require('../config/razorpay');
const mailSender= require("../utils/mailSender");
const {courseEnrollmentEmail}= require("../mailTemplates/courseEnrollmentEmail");
const {paymentSuccessEmail}= require("../mailTemplates/paymentSuccessEmail");
const { default: mongoose } = require("mongoose");
const crypto= require("crypto");

/// For all courses on checkout
// initiate the razorpay order
exports.capturePayment= async(req,res)=>{
    try{
        const {courses}= req.body;
        const userId= req.user.id;
        if (courses.length === 0){
            return res.json({
                success: false,
                message: "Please put valid courses in the cart",
                error: "course.length===0"
            });
        }
        let totalAmount= 0;
        for (const course_id of courses){
            let course;
            try{
                course= await Course.findById(course_id);
                //console.log(course.courseName,course.price,"check heree");
                if (!course){
                    return res.status(404).json({
                        success: false,
                        message: `Could not find the course with id ${course_id}`
                    })
                }
                const uId= new mongoose.Types.ObjectId(userId);
                if (course.studentsEnrolled.includes(uId)){
                    return res.json({
                        success: false,
                        messsage: `You are already enrolled in the course ${course.courseName} ${course._id}`,
                    })
                }
                totalAmount+= course.price;
            }catch(error){
                return res.status(200).json({
                    success: false,
                    message: "Error in getting courses for capturing payment",
                    error: error.message,
                })
            }
            const currency= "INR";
            const options= {
                amount: totalAmount*100,
                currency,
                receipt: Math.random(Date.now()).toString(),
            }

            try{
                const paymentResponse= await instance.orders.create(options);
                return res.json({
                    success: true,
                    message: paymentResponse,
                })
            }catch(error){
                console.log("order initiation error",error);
                return res.json({
                    success: false,
                    message: "Could not initiate the order",
                    error: error.message,
                })
            }
        }
    }catch(error){
        console.log("Error in capture payment", error.message);
    }
}

// verify the payment
exports.verifyPayment= async(req,res)=>{
    const razorpay_order_id= req.body?.razorpay_order_id;
    const razorpay_payment_id= req.body?.razorpay_payment_id;
    const razorpay_signature= req.body?.razorpay_signature;
    const courses= req.body?.courses;
    const userId= req.user.id;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.json({
            success: false,
            message: "Payment failed ! Incomplete data",
        })
    }
    try{
        let body= razorpay_order_id+ "|"+ razorpay_payment_id;
        const expectedSignature= crypto
                                .createHmac("sha256",process.env.RAZORPAY_SECRET)
                                .update(body.toString())
                                .digest("hex");
        if (expectedSignature === razorpay_signature){
            //enroll the student
            await enrollStudent(courses,userId,res);
            //return res
            return res.status(200).json({
                success: true,
                message: "Payment Verified"
            })
        }
        return res.json({
            success: false,
            message: "Error in matching the signatures",
        })    
    }catch(e){
        console.log("erorr in verification",e);
        return res.json({
            success: false,
            message: "ERror in verification",
            error: e.message,
        });
    }
    
}

const enrollStudent= async(courses,userId, res)=>{
    if (!courses || !userId){
        return res.status(404).json({
            success: false,
            message: "Provide all the data i.e. courses and user"
        });
    }
    // add student to course
    for (const courseId of courses){
        try{
            // find the course and enroll the student in it
            const enrolledCourse= await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentsEnrolled:userId}},
                {new: true},
            )
            if (!enrolledCourse){
                return res.json({
                    success: false,
                    message: "Course not found fror enrolling"
                })
            }
            // create course progress
            const courseProgress= await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            })
            // add course to student
            const enrolledStudent= await User.findByIdAndUpdate(userId,{
                $push: {
                    courses: courseId,
                    courseProgress: courseProgress,
                }
            },{new:true});
            
            // send mail
            const emailResponse=  await  mailSender(
                enrollStudent.email,
                `Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrollStudent.firstName} ${enrollStudent.lastName}`)
            )
            console.log("sent mail for course enrollment", emailResponse.response);
        }catch(error){
            console.log(error.message);
            return res.json({
                success: false,
                message: "Some error occured in enrolling the student",
                error: error.message,
            })
        }

    }


}

exports.sendPaymentSuccessEmail= async(req,res)=>{
    const {orderId, paymentId, amount}= req.body;
    const userId= req.user.id;
    if (!orderId || !paymentId || !amount || !userId){
        return res.status(404).json({
            success: false,
            message: "Please provide all the details",
        });
    }
    try{
        // find the student
        const enrolledStudent= await User.findById(userId);
        await mailSender(enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrollStudent.firstName}`, amount/100, orderId, paymentId)
            )

    }catch(error){
        console.log("Error in sending payment verification mail", error.message);
        return res.json({
            success: false,
            message: "Could not send payment verification mail",
            error: error.message,
        })
    }
}







/// FOR SINGLE COURSE
/* // capture the payment ans intiate the razorpay order
exports.capturePayment= async(req,res)=>{
    try{
        // get courseId and userId
        const {courseId}= req.body;
        const {userId}= req.user.id;
        // validation
        // valid courseId
        if (!courseId){
            return res.json({
                success: false,
                message:"Please enter valid courseId",
            });
        }
        // valid courseDetail
        let course;
        try{
            course= await Course.findById(courseId);
            if (!course){
                return res.json({
                    success: false,
                    message: "Could not find the course",
                });
            }
            // validate not already paid
            const uId= new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uId)){
                return res.json({
                    success: false,
                    message: "You are already enrolled in this course",
                })
            }
        }catch(error){
            return res.json({
                success: false,
                message: "ERror in fetching the course",
                error: error.message,
            });
        }
        // order create
        const amount= course.price;
        const currency= "INR";
        const options= {
            amount: amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseId,
                userId
            }
        };
        try{
            // intiate the payment using razorpay
            const paymentResponse= await instance.orders.create(options);
            console.log("payment res:",paymentResponse);
            // return res
            return res.json({
                success: true,
                course: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,
            });  

        }catch(error){
            return res.json({
                success: false,
                message:"Error in initiating creating the order",
                error: error.message,
            })
        }

    }catch(error){
        return res.json({
            success: false,
            message: "Error in capturing the payment",
            error: error.message,
        });
    }
}

// verify signature
exports.verifySignature= async(req,res)=>{
    const webHookSecret= "12345678";
    const signature= req.headers["x-razorpay-signature"];

    const shasum= crypto.createHmac("sha256",webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest= shasum.digest("hex");

    if (signature === digest){
        console.log("Payment is authorized");

        // verifySignature wla function razorpay call karega frontend se nhi jayega so req.body mein hum log courseId y auserId nhi pass kar skte
        // isliye notes mein pass kiye the order create karte time
        const {courseId, userId}= req.body.payload.payment.entity.notes;
        try{
            //fulfil the action
            // find the course anad enroll the student into it
            const enrolledCourse= await Course.findByIdAndUpdate({_id:courseId},{
                $push:{
                    studentsEnrolled: userId,
                }
            },{new:true});
            if (!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Error in enrolling into the course"
                })
            }
            console.log(enrolledCourse);
            // update course in student
            const enrolledStudent=await User.findByIdAndUpdate({_id:userId},{
                $push:{
                    courses: courseId,
                }
            },{new:true});
            console.log(enrolledStudent);

            // send confirmation email
            const emailResponse= await mailSender(enrolledStudent.email,
                                    "Enrolled Success|| Studynotion",
                                    "YOu are successsfully registered"
                );

            return res.status(200).json({
                success: true,
                messsage: "You are enrolled into the course successfully",
            });
        }catch(error){
            return res.json({
                success: false,
                message: "Error in enrollment",
                error: error.message,
            })
        }
    }
    else{
        return res.status(400).json({
            successs: false,
            message: "Invalid request! could not verify signature"
        })
    }
}
 */
