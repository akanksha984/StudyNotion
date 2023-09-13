const express= require('express');
const router= express.Router();

const {createCourse,getAllCourses,getCourseDetails,getInstructorCourses,deleteCourse, editCourse, getFullCourseDetails}= require("../controllers/Course");
const {showAllCategories,createCategory,categoryPageDetails}= require("../controllers/Category");
const {createSection,updateSection,deleteSection}= require("../controllers/Section");
const {createSubsection, updateSubsection, deleteSubsection}= require("../controllers/Subsection");
const {createRating,getAverageRating,getAllRatingAndReviews}= require("../controllers/RatingAndReview");

const {auth, isInstructor, isStudent, isAdmin}= require("../middlewares/auth");
const { updateCourseProgress, getProgressPercentage } = require('../controllers/CourseProgress');

//  COURSE ROUTES
router.post('/createCourse',auth,isInstructor,createCourse);
router.post('/addSection',auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.delete("/deleteSection",auth,isInstructor,deleteSection);
router.post("/updateSubsection",auth,isInstructor,updateSubsection);
router.delete("/deleteSubsection",auth,isInstructor,deleteSubsection);
router.post("/addSubsection",auth,isInstructor,createSubsection);
router.get("/getAllCourses",getAllCourses);
router.post("/getCourseDetails",getCourseDetails);
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses);
router.delete("/deleteCourse",auth,isInstructor,deleteCourse);
router.post("/editCourse",auth,isInstructor,editCourse);
router.post("/getFullCourseDetails",auth,getFullCourseDetails);
router.post("/updateCourseProgress",auth, isStudent,updateCourseProgress);
router.post("/getProgressPercentage",auth,isStudent,getProgressPercentage);

// CATEGORY ROUTES-> FOR ADMIN
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/getCategoryPageDetails",categoryPageDetails);

// RATING AND REVIEW
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating",getAverageRating);
router.get("/getReviews",getAllRatingAndReviews);

module.exports= router;

