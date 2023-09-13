const RatingAndReview = require('../models/RatingAndReview');
const Course= require('../models/Course');
const mongoose= require('mongoose');

// create Rating
exports.createRating= async(req,res)=>{
    try{
        // fetch the data
        const userId = req.user.id;
        const {rating,review,courseId}= req.body;
        // validate
        // check if user is not already enrolled
        console.log(userId,courseId, "rating..")
        const enrolled= await Course.findOne({
                                    _id:courseId,
                                    studentsEnrolled: {
                                        $elemMatch: {$eq:userId}
                                    }
                                });
        if (!enrolled){
            return res.status(404).json({
                success: false,
                message: "You are not registered for the course",
            })
        }
        // check if user has already reviewed the course
        const alreadyReviewed= await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed){
            return res.json({
                success: false,
                message: "You cannot review again",
            })
        }
        // create rating
        const ratingReview= await RatingAndReview.create({
            user: userId,
            rating: rating,
            review: review,
            course: courseId
        });
        // update rating in course
        await Course.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews: ratingReview._id,
            } },
            {new:true}
        )
        // return res
        return res.json({
            success: true,
            message: "You have successfully given reviews and rating"
        })
    }catch(error){
        return res.status(400).json({
            success: false,
            message: "Error in creating the rating",
            error: error.message,
        });
    }
}
// get average rating
exports.getAverageRating= async(req,res)=>{
    try{
        // get course id
        const {courseId}= req.body.courseId;
        // calculate avg rating
        const result= await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
                {
                    $group: {
                        _id: null,
                        averageRating: {$avg: "$rating"},
                    }
                }
        ]);
        //return rating
        if (result.length>0){
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }
        // no reviews exist
        return res.status(200).json({
            success: true,
            message: "No ratings given till now",
            averageRating:0,
        })
    }catch(error){
        return res.json({
            success: true,
            message:"Could not create average rating",
            error: error.message,
        });
    }
}

//get all ratings and reviews
exports.getAllRatingAndReviews= async(req,res)=>{
    try{
        // find the ratings,
        const allRatingsAndReviews= await RatingAndReview.find({})
                                    .sort({rating:"desc"})
                                    .populate({
                                        path:"user",
                                        select: "firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select:"courseName",
                                    })
                                    .exec();
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allRatingsAndReviews,
        })
    }catch(error){
        return res.json({
            success: false,
            message:"Error in fetching all the ratings",
            error: error.message,
        })
    }
}

