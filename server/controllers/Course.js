const Category= require("../models/Category");
const Course= require('../models/Course');
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User= require('../models/User');
const CourseProgress= require("../models/CourseProgress");
const {uploadImageToCloudinary}= require("../utils/imageUploader");
const {convertSecondsToDuration}= require("../utils/secToDuration");
require('dotenv').config();

exports.createCourse= async(req,res)=>{
    try{
        // fetch data
        let {courseName,courseDescription,whatYouWillLearn,price,tag:_tag,category,status,instructions:_instructions}= req.body;
        // fetch file
        const thumbnail= req.files.thumbnailImage;
        // get instructor details for object id
        const userId= req.user.id;

        //convert tag and instructions from stringified array to array
        const tag= JSON.parse(_tag);
        const instructions= JSON.parse(_instructions);
        console.log("tag: ",tag);
        console.log("instructions: ", instructions);

        // validation
        if  (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag.length || !instructions.length){
            return res.status(400).json({
                success: false,
                message: "Please enter all the details",
            }); 
        }

        if (!status || status===undefined){
            status="Draft";
        }
        const instructorDetails= await User.findById(userId);
        console.log("instructor details->",instructorDetails);
        if (!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }
        // check for validity of category
        const categoryDetail= await Category.findById(category);
        if (!categoryDetail){
            return res.status(404).json({
                success: false,
                message: "category details not found",
            });
        }
        const thumbnailImage= await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME_THUMBNAIL);

        // create an entry for new course in db
        //console.log("got price",price, typeof(parseInt(price)));
        const p1= parseInt(price) ;
        //console.log(typeof(p1),"<-- new price type");
        const newCourse= await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price: p1,
            category: categoryDetail._id,
            thumbnail: thumbnailImage.secure_url,
            tags: tag,
            status: status,
            instructions,
        });
        console.log(newCourse);
        // add to instructor course list;
        await User.findByIdAndUpdate({_id:instructorDetails._id},{
            $push: {
                courses: newCourse._id, 
            },
        },{new:true});

        // update the category schema
        await Category.findByIdAndUpdate({_id:category},{
            $push:{
                course: newCourse._id,
            }
        },{new:true});

        //return res
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        })

    }catch(error){
        console.log("Error in course creation");
        return res.status(500).json({
            success: false,
            message: "Course could not be created! Please try again",
            error: error.message,
        })
    }
}

exports.getAllCourses= async(req,res)=>{
    try{
        const allCourses= await Course.find({},{
            courseName: true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).populate("instructor").exec();
        //const allCourses= await Course.find();
        return res.status(200).json({
            success:true,
            message: "Fetched all the courses successfully",
            data: allCourses,
        })
    }catch(error){
        return res.json({
            success: false,
            message:"Error in fetching all the courses",
            error: error.message,
        });
    }
}

exports.getCourseDetails= async(req,res)=>{
    try{
        // fetch the course id
        //console.log("req mein aya", req);
        //console.log("req mein aya", req.body);
        const {courseId}= req.body;
        //console.log("Course id is-->", courseId);
        // fetch the details
        const courseDetails= await Course.findById({_id:courseId})
                                .populate(
                                    {
                                        path: "instructor",
                                        populate:{
                                            path:"additionalDetails",
                                        }
                                    }
                                )
                                .populate("category")
                                //.populate("ratingAndReview")
                                .populate({
                                    path: "courseContent",
                                    populate:{
                                        path:"subSection",
                                        select:"-videoUrl"
                                    }
                                })
                                .exec();
        console.log("Course details are: ",courseDetails);
        // validation
        if (!courseDetails){
        return res.json({
            success: false,
            message: `Could not find course with id ${courseId}`
        })
        }
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails
        })

    }catch(error){
        return res.json({
            success: false,
            message:"Error in fetching the course details",
            error: error.message,
        })
    }
}

exports.getInstructorCourses= async(req,res)=>{
    try{
        const instructorId= req.user.id;
        const instructorCourses= await Course.find({instructor:instructorId}).sort({createdAt: -1});
        return res.status(200).json({
            success: true,
            message:"Got the instructor courses",
            data: instructorCourses,
        })
    } catch(error){
        console.log("error in getting instructor course");
        return res.json({
            success: false,
            message:"Error in getting instructor courses",
            error: error.message,
        })
    } 
}

exports.deleteCourse= async(req,res)=>{
    try{
        const {courseId}= req.body;
        console.log("id of courese",courseId);
        const course= await Course.findById(courseId);
        if (!course){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            })
        }
        // unenroll students from the course
        const studentsEnrolled= course.studentsEnrolled;
        for (const studentId of studentsEnrolled){
            await User.findByIdAndUpdate(studentId,{
                $pull:{courses: courseId},
            },{new:true})
        }
        // delete section and subsection
        const courseSections= course.courseContent;
        for (const sectionId of courseSections){
            const section= await Section.findById(sectionId);
            // delete the subsections
            if (section){
                const subSections= section.subSection;
                for (const subSectionId of subSections){
                    await SubSection.findByIdAndDelete(subSectionId);
                } 
                //delete the section
                await Section.findByIdAndDelete(sectionId);   
            }
        }
        // dleete the course
        await Course.findByIdAndDelete(courseId);
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Could not delete the course",
            error: error.message,
        })
    }
}

exports.editCourse= async(req,res)=>{
    try{
        const {courseId}= req.body;
        const updates= req.body;
        const course= await Course.findById(courseId);
        if (!course){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            })
        }
        // if thumbnail is updated
        if (req.files){
            console.log("thumbnail update");
            const thumbnail= req.files.thumbnailImage;
            const thumbnailImage= await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME_THUMBNAIL);
            course.thumbnail= thumbnailImage.secure_url;
        }
        // update only the fields that are present in the request body
        for (const key in updates){
            if (updates.hasOwnProperty(key)){
                if (key==="_tag" || key==="instructions"){
                    course[key]= JSON.parse(updates[key]);
                }
                else{
                    course[key]= updates[key];
                }
            }
        }
        await course.save();
        const updatedCourse= await Course.findById(courseId)
                            .populate({
                                path: "instructor",
                                populate:{
                                    path: "additionalDetails",
                                }
                            })
                            .populate("category")
                            .populate("ratingAndReviews")
                            .populate({
                                path:"courseContent",
                                populate:{
                                    path: "subSection",
                                }
                            })
                            .exec();
        return res.json({
            success:true,
            message: "Course updated successfully",
            data: updatedCourse,
        })
    }catch(error){
        return res.json({
            success:false,
            error: error.message,
            message: "Error in course Edit",
        })
    }
}

exports.getFullCourseDetails= async(req,res)=>{
    try{
        const {courseId}= req.body;
        const userId= req.user.id;
        const courseDetails= await Course.findById(courseId)
                                .populate({
                                    path: "instructor",
                                    populate:{
                                        path: "additionalDetails",
                                    }
                                })
                                .populate("category")
                                .populate("ratingAndReviews")
                                .populate({
                                    path: "courseContent",
                                    populate: {
                                        path: "subSection",
                                    }
                                }).exec();
        let courseProgressCount= await CourseProgress.findOne({
            courseId: courseId,
            userId: userId,
        });
        console.log("courseprogress count--> ",courseProgressCount);
        if (!courseDetails){
            return res.status(404).json({
                success: false,
                message: `Could not find the course with id ${courseId}`,
            })
        }
        /* console.log("user",userId,"inst",courseDetails.instructor._id.toString());
        const temp= courseDetails.instructor._id.toString();
        if (courseDetails.status === "Draft" && userId!==temp){
            return res.status(403).json({
                success: false,
                message: "The Course is not yet published. You will be able to access the course only when it would be published"
            })
        } */
        let totalDurationInSeconds=0;
        courseDetails.courseContent.forEach((content)=>{
            content.subSection.forEach((subsec)=>{
                totalDurationInSeconds+= parseInt(subsec.timeDuration);
            })
        })
        const totalDuration= convertSecondsToDuration(totalDurationInSeconds);
        return res.status(200).json({
            success: true,
            data: {
                courseDetails,totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                ? courseProgressCount.completedVideos
                :[],
            }
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Error occured while getting full course details",
            error: error.message,
        })
    }
}

