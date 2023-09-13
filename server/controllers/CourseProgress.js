const mongoose= require("mongoose");
const Course= require("../models/Course");
const CourseProgress= require("../models/CourseProgress");
const Section= require("../models/Section");
const SubSection= require("../models/SubSection")

exports.updateCourseProgress= async(req,res)=>{
    const {courseId,subsectionId}= req.body;
    const userId= req.user.id;
    try{
        // checck if it is valid subsection or not;
        const subsection= await SubSection.findById(subsectionId);
        if (!subsection){
            return res.status(404).json({
                success: false,
                message: "Subsection not found",
            });
        }
        // find course progress for user of the course
        let courseProgress= await CourseProgress.findOne({
            courseId: courseId,
            userId: userId,
        })
        if (!courseProgress){
            // if course progress doesnot exist,
            return res.status(404).json({
                success: false,
                message: "Course progress does not exist"
            })
        }else{
            // check if subsection i s already completed
            if (courseProgress.completedVideos.includes(subsectionId)){
                return res.status(400).json({
                    success: false,
                    message: "Subsection is already completed"
                })
            }
            // if the subsection is not completed, add teh subsection to completedVideos
            courseProgress.completedVideos.push(subsectionId)
            // save the updated course progress
            await courseProgress.save();
            return res.status(200).json({
                success: true,
                message: "Course progress successfully updated"
            })
        }

    }catch(error){
        console.log("error in updating the course progress", error.message);
        return res.json({
            success: false,
            message: "Error in updating the course progress",
            error: error.message,
        })
    }
}

exports.getProgressPercentage= async(req,res)=>{
    try{

    }catch(error){
        return res.json({
            success: false,
            message: "Error in getting progress percentage",
            error: error.message,
        })
    }
}