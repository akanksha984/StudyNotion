const Section= require('../models/Section');
const Course= require('../models/Course');
const SubSection= require("../models/SubSection");
const { default: mongoose } = require('mongoose');

exports.createSection= async(req,res)=>{
    try{
        // fetch all the data
        const {sectionName,courseId}= req.body;
        // validate all the data
        if (!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Please enter all the details",
            });
        }
        const course= await Course.findById(courseId);
        if (!course){
            return res.status(404).json({
                success: false,
                message: "Please create the course first",
            })
        }
        // create section
        const newSection= await Section.create({
            sectionName: sectionName,
        });
        // insert into courses the objectId
        const updatedCourse= await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent: newSection._id,
            }
        },{new: true}).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        }).exec();
        // return res
        return res.status(200).json({
            success: true,
            message: "Created section successfully",
            updatedCourse: updatedCourse,
        });
    }catch(err){
        console.log("error in section creation");
        return res.status(500).json({
            success: false,
            message: "Error in section creation",
            error: err.message,
        });
    }
}

exports.updateSection= async(req,res)=>{
    try{
        // fetch data
        const {sectionName,sectionId,courseId}= req.body;
        //validate data
        if (!sectionName || !sectionId){
            return res.json({
                success: false,
                message: "Please enter all the details"
            });
        }
        //update in db
        const section= await Section.findByIdAndUpdate(sectionId,{
            sectionName: sectionName,
        },{new:true});
        // create the course
        const course= await Course.findById(courseId).populate({
            path: "courseContent",
            populate:{
                path:"subSection",
            }
        })
        //return res 
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: course,
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in updating the section",
            error: error.message,
        })
    }
}

exports.deleteSection= async(req,res)=>{
    try{
        // fetch the sectionId
        // trying this time to get id by sending them in params
        const {sectionId,courseId}= req.body;
        // delete section from course
         await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent: sectionId,
            }
        },{new:true})
        // find the section
        const section= await Section.findById({_id:sectionId});
        if (!section){
            return res.status(404).json({
                success: false,
                message: "section not found"
            })
        }
        // delete thte subsection
        await SubSection.deleteMany({_id: {$in: section.subSection}});
        // findby id and delete
        await Section.findByIdAndDelete({_id:sectionId});
        // create course
        const course= await Course.find({_id:courseId}).populate({
            path: "courseContent",
            populate:{
                path: "subSection"
            }
        }).exec();
        //return res
        return res.status(200).json({
            success:true,
            message: "Section deleted successfully",
            data: course[0],
        });

    }catch(error){
        return res.json({
            success: false,
            message: "Error in deleting the section. Try again",
            error: error.message,
        })
    }
}
