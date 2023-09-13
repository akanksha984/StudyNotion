import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseAPI";
import { toast } from "react-hot-toast";
import {RxCross2} from "react-icons/rx";

const CourseReviewModal= ({setReviewModal})=>{
    const {user}= useSelector((state)=>state.profile);
    const {token}= useSelector((state)=>state.auth);
    const {register,handleSubmit,formState:{errors}, setValue}= useForm();
    const {courseEntireData}= useSelector((state)=>state.viewCourse)
    useEffect(()=>{
        setValue("courseExperience","");
        setValue("courseRating", 0);
    },[]);
    async function submitHandler(data){
        await createRating({
            courseId: courseEntireData._id,
            rating: data.courseRating,
            review: data.courseExperience
        },token);
        setReviewModal(false);
        toast.success("Posted the comment successfully");
    }
    function ratingChangeHandler(newRating){
        setValue("courseRating",newRating);
    }
    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center h-screen w-screen overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-rickblack-400 bg-richblack-900">
                {/* Modal header */}
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <p className="text-2xl font-semibold text-richblack-5"> Add Review </p>
                    <button onClick={()=>setReviewModal(false)}>
                        <RxCross2 className="text-2xl text-pink-200 font-bold" />
                    </button>
                </div>

                {/* modal body */}
                <div className="p-6">
                    <div className="flex items-center justify-center gap-x-4">
                        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} 
                        className="aspect-square w-[50px] rounded-full object-cover"/>
                        <div className="">
                            <p className="text-richblack-5 font-bold">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-richblack-200 italic"> Posting Publically </p>
                        </div>
                    </div>  
                    <form onSubmit={handleSubmit(submitHandler)}
                    className="mt-6 flex flex-col items-center">
                        <ReactStars count={5} onChange={ratingChangeHandler} size={35} activeColor="#ffd700" />
                        <div className="flex w-11/12 flex-col space-y-2">
                            <label htmlFor="courseExperience" className="label-style">
                                Add Your Experience <sup className="rext-pink-200">*</sup>
                            </label>
                            <textarea id="courseExperience" placeholder="Share your experience regarding this course" 
                            {...register("courseExperience",{required:true})} 
                            className="input-style resize-x-none min-h-[130px] w-full"/>
                            {
                                errors.courseExperience && (
                                    <span>
                                        Please add your experience...
                                    </span>
                                )
                            }
                        </div>

                        {/* cancel and post button */}
                        <div className="flex gap-x-2 mt-6 justifyend">
                            <button onClick={()=>setReviewModal(false)}
                            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                                Cancel
                            </button>
                            <IconBtn text="Save" />
                        </div>
                    </form>  
                </div>
            </div>
        </div>
    )
}

export default CourseReviewModal;