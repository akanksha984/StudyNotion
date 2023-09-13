import { useDispatch, useSelector } from "react-redux";
import { buyCourse } from "../services/operations/StudentFeatures";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect,useState } from "react";
import { fetchCourseDetails } from "../services/operations/courseAPI";
import avgRating from "../utils/avgRating"
import Error from "./Error";
import ConfirmationModal from "../components/common/confirmationModal";
import RatingStars from "../components/common/RatingStars";
import {formattedDate} from "../utils/dateFormat";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import Footer from "../components/common/Footer"
import { BsInfoCircle } from "react-icons/bs";
import {HiOutlineGlobeAlt} from "react-icons/hi";
import {ReactMarkdown} from "react-markdown/lib/react-markdown"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import { addToCart } from "../slices/cartSlice"

const CourseDetails= ()=>{
    const {user}= useSelector((state)=>state.profile);
    const {token}= useSelector((state)=>state.auth);
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const {courseId}= useParams();
    const {loading}= useSelector((state)=>state.profile);
    const {paymentLoading}= useSelector((state)=>state.course);

    const [courseData, setCourseData]= useState(null);
    const [avgReviewCount,setAvgReviewCount]= useState(0);
    const [totalNoOfLectures,setTotalNoOfLectures]= useState(0);
    const [confirmationModal,setConfirmationModal]= useState(null);
    const [isActive, setIsActive]= useState([]);

    //console.log("using params got course id->", courseId);
    useEffect(()=>{
        const getCourseFullDetails= async()=>{
            try{
                const result= await fetchCourseDetails(courseId);
                setCourseData(result);
            }catch(error){
                console.log("Could not fetch course details",error);
            }     
        }
        getCourseFullDetails();
    },[courseId]);

    /* useEffect(()=>{
        const count= avgRating(courseData?.data?.courseDetails?.ratingAndReviews);
        setAvgReviewCount(count);
    },[courseData]);
 */
    useEffect(()=>{
        let lectures= 0;
        courseData?.data?.courseContent?.forEach((sec)=>{
            lectures+= sec.subSection.length || 0;
            console.log("got len as sec-> ",sec.subSection.length);
        });
        console.log(lectures,"total lec");
        setTotalNoOfLectures(lectures);
    },[courseData]);
    const handleBuyCourse= ()=>{
        if (token){
            buyCourse(token,[courseId], user,navigate,dispatch);
            return; 
        }
        //toast.error("Please log in to Studynotion to buy this course");
        setConfirmationModal({
            text1: "You are not logged in",
            text2:"You must be logged in to buy the course",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })
    }
    function handleAddToCart(){
        if (user && user?.accountType==="INSTRUCTOR"){
            toast.error("You are instructor, You cannot buy any course");
            return;
        }
        if (token){
            //console.log("add to cart karne jaa rhe")
            dispatch(addToCart(course));
            return;
        }
        setConfirmationModal({
            text1:"You are not logged in",
            text2: "Please login to add to cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=> setConfirmationModal(null),
        })
    }
    const handleActive= (id)=>{
        // toggle the section
        setIsActive(
            !isActive.includes(id)
            ?isActive.concat(id)
            :isActive.filter((e)=>e!=id)
        )
    }
    if (loading || !courseData){
        return (
            <div>
                Loading...
            </div>
        )
    }
    if (!courseData.success){
        return <div>
            <Error/>
        </div>
    }
    //console.log(courseData.data);
    //console.log(courseData);
    //console.log("isActive in details page",isActive)
    const {
        id: course_id,
        courseName, courseDescription, thumbnail, price, whatYouWillLearn, courseContent, ratingAndReviews, instructor, studentsEnrolled, createdAt
    }= courseData.data;
    const course= courseData.data;
    return (
        <div>  
            <div className=" relative w-full bg-richblack-800">
                <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
                    {/* hero section */}
                    <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                        <div className="relative block max-h-[30rem] lg:hidden">
                            <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                            <img src={thumbnail} alt="course thumbnail" className="aspect-auto w-full" />
                        </div>
                        <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5">
                            <div className="text-4xl font-bold sm:text-[42px]">
                            <p>{courseName}</p> 
                            </div>
                            <p className="text-richblack-200">{courseDescription}</p>
                            <div className="text-md flex flex-wrap items-center gap-2">
                                <span className="text-yellow-25">{avgReviewCount}</span>
                                <RatingStars reviewCount={avgReviewCount} starSize={24} />
                                <span>
                                    {`(${ratingAndReviews.length} Reviews)`}
                                </span>
                                <span>
                                    {`${studentsEnrolled.length} `} Students Enrolled
                                </span>
                            </div>
                            <div>
                            <p>
                                Created By {`${instructor.firstName} ${instructor.lastName}`}
                            </p>
                            </div> 
                            <div className="flex flex-wrap gap-5 text-lg">
                                <p className="flex items-center gap-2">
                                    {" "} <BsInfoCircle/>
                                    Created At {formattedDate(createdAt)} 
                                </p>
                                <p className="flex items-center gap-2">
                                    {" "} <HiOutlineGlobeAlt />
                                    English
                                </p>
                            </div>
                        </div>   
                        <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                            <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                                Rs. {price}
                            </p>
                            <button className="yellow-button" onClick={handleBuyCourse}>
                                Buy Now
                            </button>
                            <button className="black-button"  onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>    
                    </div>
                    {/* course cards  */}
                    <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
                        <CourseDetailsCard 
                        handleAddToCart={handleAddToCart}
                        course= {courseData.data}
                        setConfirmationModal= {setConfirmationModal}
                        handleBuyCourse= {handleBuyCourse}
                        />
                    </div>     
                </div>
            </div> 

            <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">         
                <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                    {/* whatYouWillLearn section */}
                    <div className="my-8 border border-richblack-600 p-8">
                        <p className="text-3xl font-semibold">What you will learn</p>
                        <div className="mt-5">
                            <ReactMarkdown>
                                {whatYouWillLearn}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* course content section */}
                    <div className="max-w-[830px]">
                        
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] font-semibold">Course Content</p>
                            <div className="flex flex-wrap justify-between gap-2">
                                <div className="flex gap-2">
                                    <span>{courseContent.length} sections || </span>
                                    <span>{totalNoOfLectures} lectures || </span>
                                    <span>
                                        {courseData.data.totalDuration} total length
                                    </span>
                                </div>
                                
                                <div>
                                    <button onClick={()=>setIsActive([])} className="text-yellow-25">
                                        Collapse All Sections
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* course details accordion */}
                        <div className="py-4">
                            {
                                courseContent.map((section,index)=>{
                                    return(
                                    <CourseAccordionBar section={section}
                                    key={index} isActive={isActive}
                                    handleActive={handleActive}
                                    />)
                                })
                            }
                        </div>

                        {/* author details */}
                        <div className="mb-12 py-4">
                            <p className="text-[28px] font-semibold">Author</p>
                            <div className="flex items-center gap-4 py-4">
                                <img src={instructor.image} alt={instructor.firstName}
                                className="h-14 w-14 rounded-full object-cover" />
                                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                            </div>
                            <p className="text-richblack-100">
                                {instructor.additionalDetails.about}
                            </p>
                        </div>

                    </div>
                </div>   
            </div>

            <Footer />
            {
                confirmationModal && <ConfirmationModal modalData={confirmationModal}/>
            }
              
        </div>
    )
}

export default CourseDetails;