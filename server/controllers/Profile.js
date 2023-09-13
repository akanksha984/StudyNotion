const Profile= require("../models/Profile");
const User= require("../models/User"); 
const CourseProgress= require("../models/CourseProgress");
const {uploadImageToCloudinary}= require("../utils/imageUploader");
const {convertSecondsToDuration}= require("../utils/secToDuration");
const Course = require("../models/Course");

//we are not creating createProfile function because we have already created null profiel while account creation
exports.updateProfile= async(req,res)=>{
    try{
        // fetch the data
        const {dateOfBirth="",about="",contactNumber, gender}= req.body;
        const userId = req.user.id;
        // validation
/*         if (!contactNumber || !gender || !userId){
            return res.json({
                success: false,
                message: "Please fill all the details"
            })
        } */
        // find the profile anad update    
        console.log(userId);
        const userDetails= await User.findById(userId);
        const profileId= userDetails.additionalDetails;
        await Profile.findByIdAndUpdate(profileId,{
             dateOfBirth:dateOfBirth,
             about: about,
             gender: gender,
             contactNumber: contactNumber,
        },{new:true});
        //  other way of doind the same
        /* console.log("userdetails-> ",userDetails);
        console.log(userDetails.additionalDetails);
        const profile= await Profile.findById(userDetails.additionalDetails);
        console.log(profile);
        profile.dateOfBirth= dateOfBirth;
        profile.about= about;
        profile.contactNumber= contactNumber;
        profile.gender= gender;
        await profile.save(); */

        //return res
        return res.status(200).json({
            success: true, 
            message: "Profile updated successfully"
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Error in updating the profile",
            error: error.message,
        })
    }
}

// delete account
exports.deleteAccount= async(req,res)=>{
    try{
        // TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);

        //fetch the id
        //console.log(req.user);
        const userId= req.user.id;
        //console.log(req.user.id,"userId-> ",userId);
        // validate
        const userDetails= await User.findById({_id:userId});
        if (!userDetails){
            return res.status(404).json({
                success: false,
                message: "No user details could be found",
            });
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // delete from course 
        // delete user
        await User.findByIdAndDelete({_id:userId});
        //return res
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            messafe: "Error occured while deleting the account",
            error: error.message,
        })
    }
}

// get all details
exports.getAllUserDetails= async(req,res)=>{
    try{
        // get id
        const userId= req.user.id;
        // validate and get user details
        const userDetails= await User.findById(userId).populate("additionalDetails").exec();
        //return res
        return res.json({
            success: true,
            message: "Fetched user details successfully",
            data: userDetails,
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Error in getting the user details",
            error: error.message,
        })
    }
}

// update the display picture
exports.updateDisplayPicture= async(req,res)=>{
    try{
        const displayPicture= req.files.displayPicture;
        const userId= req.user.id;
        const imagePic= await uploadImageToCloudinary(displayPicture,process.env.FOLDER_NAME_USER,1000,1000);
        const updatedProfile= await User.findByIdAndUpdate({_id:userId},
            {image: imagePic.secure_url},
        {new: true});
        console.log(updatedProfile);
        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: updatedProfile,
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Error in updating the profile pic",
            error: error.message,
        });
    }
}

// get enrolled courses
exports.getEnrolledCourses= async(req,res)=>{
    try{
        const userId= req.user.id;
        var userDetails= await User.findById(userId)
        .populate({
            path: "courses",
            populate:{
                path:"courseContent",
                populate:{
                    path: "subSection",
                }
            }
        })
        .exec();
        userDetails= userDetails.toObject();
        var subsectionLength= 0;
        for (var i=0; i<userDetails.courses.length; i++){
            let totalDurationInSeconds= 0;
            subsectionLength=0;
            for (var j=0; j<userDetails.courses[i].courseContent.length; j++){
                totalDurationInSeconds+= userDetails.courses[i].courseContent[j].subSection.reduce((acc,curr)=>acc+parseInt(curr.timeDuration),0)
                userDetails.courses[i].totalDuration= convertSecondsToDuration(totalDurationInSeconds);
                subsectionLength+= userDetails.courses[i].courseContent[j].subSection.length;
            }
            let courseProgressCount= await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount= courseProgressCount?.completedVideos.length
            if (subsectionLength===0){
                userDetails.courses[i].progressPercentage= 100
            }else{
                // to make it upto 2 decimal points
                const multiplier= Math.pow(10,2);
                userDetails.courses[i].progressPercentage= Math.round((courseProgressCount/subsectionLength)*100*multiplier)/multiplier
            }
        console.log(courseProgressCount);
        }
        if (!userDetails){
            return res.json({
                success: false,
                message: `Could not find user with id ${userId}`,
            });
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Error in fetching the enrolled courses",
            error: error.message,
        })
    }
}

exports.instructorDashboard= async(req,res)=>{
    try{
        const userId= req.user.id;
        const courseDetails= await Course.find({instructor: userId});
        const courseData= courseDetails.map((course)=>{
            const totalStudentsEnrolled= course.studentsEnrolled.length;
            const totalAmountGenerated= totalStudentsEnrolled*course.price;

            // create a new object with the additional fields
            const courseDataWithStats= {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }
            return courseDataWithStats;
        })
        return res.status(200).json({
            success: true,
            message: "Successfully fetched the instructor dashboard details",
            courses: courseData,
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Error in getting instructor dashboard details",
            error: error.message,
        })
    }
}
