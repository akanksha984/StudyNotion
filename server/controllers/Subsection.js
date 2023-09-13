const Subsection= require('../models/SubSection');
const Section= require('../models/Section');
const {uploadImageToCloudinary}= require('../utils/imageUploader');
require('dotenv').config();

exports.createSubsection= async(req,res)=>{
    try{
        //fetch the data
        const {title,timeDuration,description,sectionId}= req.body;
        // fetch the file
        const video= req.files.videoFile;
        //validate the data
        if (!title || !description || !sectionId || !video){
            return res.json({
                success: false,
                message:"Please enter all the details",
                error: {title,description,sectionId,video}
            });
        }
        //upload video to cloudinary
        const uploadDetails= await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const newSubsection= await Subsection.create({
            title:title, 
            description:description,
            timeDuration:timeDuration,
            videoUrl: uploadDetails.secure_url,
        });
        //update the subsection in section
        const subSec= await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                subSection: newSubsection._id,
            }
        },{new:true}).populate("subSection");
        //return the res
        return res.status(200).json({
            success:true,
            message: "Subsection created successfully",
            data: subSec,
        })
    }catch(error){
        return res.json({
            success: false,
            message: "Error in subsection creation",
            error: error.message
        });
    }
}

exports.updateSubsection= async(req,res)=>{
    try{
        // fetch the details
       /*  const {subsectionId,title,timeDuration,description}= req.body;
        const video= req.files.videoFile;
        // validate
        if (!subsectionId){
            return req.status(404).json({
                succcess: false,
                message: "Subsection not found",  
            })
        }
        if (title!== undefined){
            subse
        }
        //upload to cloudinary
        const uploadDetails= uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //update
        await Subsection.findByIdAndUpdate(subsectionId,{
            title: title,
            description:description,
            timeDuration: timeDuration,
            videoUrl: uploadDetails.secure_url,
        },{new:true}); */
        const {sectionId, subSectionId, title, description}= req.body;
        const subSection= await Subsection.findById(subSectionId);
        if (!subSection){
            console.log("gir id", subSectionId);
            return res.status(404).json({
                success: false,
                message: "subsection not found",
                id: subSectionId
            });
        }
        if (title!== undefined){
            subSection.title= title;
        }
        if (description!== undefined){
            subSection.description= description;
        }
        if (req.files && req.files.videoFile !== undefined){
            const video= req.files.videoFile;
            const uploadDetails= await uploadImageToCloudinary(video,process.env.FOLDER_NAME_THUMBNAIL);
            subSection.videoUrl= uploadDetails.secure_url;
            subSection.timeDuration= `${uploadDetails.duration}`
            
        }
        await subSection.save();
        const updatedSection= await Section.findById(sectionId).populate("subSection").exec();
        //return res
        return res.status(200).json({
            success: true,
            message: "Updated the subsection successfully",
            data: updatedSection
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error occured in updating the subsection",
            error: error.message,
        })
    }
}

exports.deleteSubsection= async(req,res)=>{
    try{
        // fetch the sectionId
        const {subSectionId,sectionId}= req.body;
        // remove it from subsection
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {$pull: {subSection:subSectionId}},
            
        )
        //findAnd delete
        const subsec= await Subsection.findByIdAndDelete({_id:subSectionId});
        //console.log(subsec);
        //const alldemo= await Subsection.find({});
        const updatedSection= await Section.findById({_id:sectionId}).populate("subSection").exec();
        if (!subsec){
            return res.status(404).json({
                success: false,
                message: "Subsection is not found",
                /* give:subSectionId,
                id: alldemo, */
            })
        }
        // return res
        return res.status(200).json({
            success:true,
            message: "Subsection deleted successfully!",
            data: updatedSection
        })

    }catch(error){
         return res.json({
            success: false,
            message: "Error in deleting the subsection",
            error: error.message,
         });
    }
}




