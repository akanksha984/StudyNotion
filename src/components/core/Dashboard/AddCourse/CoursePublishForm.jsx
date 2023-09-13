import { useState } from "react";
import { get, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { resetCourseState, setStep } from "../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../utils/constant";
import { useEffect } from "react";
import { editCourseDetails } from "../../../../services/operations/courseAPI";
import { useNavigate } from "react-router-dom";

const CoursePublishForm= ()=>{
    const {register,handleSubmit,getValues,setValue,formState:{errors}}= useForm();
    const dispatch= useDispatch();
    const {token}= useSelector((state)=>state.auth);
    const {course,setCourse}= useSelector((state)=>state.course);
    const [loading,setLoading]= useState(false);
    const navigate= useNavigate();

    useEffect(()=>{
        if (course.status === COURSE_STATUS.PUBLISHED){
            setValue("public",true);
        }
    },[]);

    const goBack= ()=>{
        dispatch(setStep(2));
    }
    const submitHandler=()=>{
        handleCoursePublish();
    }
    const handleCoursePublish= async()=>{
        if (course.status === COURSE_STATUS.PUBLISHED && getValues("public")===true ||
        course.status === COURSE_STATUS.DRAFT && getValues("public")===false){
            // no updation in form;
            goToCourses();
            return;
        }
        const formData= new FormData();
        formData.append("courseId",course._id);
        const courseStatus= getValues("public")?COURSE_STATUS.PUBLISHED: COURSE_STATUS.DRAFT;
        formData.append("status",courseStatus);
        setLoading(true);
        const response= await editCourseDetails(formData,token);
        if (response){
            goToCourses();
        }
        setLoading(false);
    }
    const goToCourses= ()=>{
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    }
    return (
        <div className="bg-richblack-800 rounded-md border border-richblack-700 p-6">
            <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>
            <form onSubmit={handleSubmit(submitHandler)}>
                <div className="my-6 mb-8">
                    <label htmlFor="public" className="label-style flex justify-between">
                        <p className="flex gap-x-2 items-center">
                        Publish Course
                            <input
                            type="checkbox" id="public"
                            {...register("public",{required:true})}
                            className="checkbox-style"
                            />
                        </p>
                        <span className="ml-2 text-richblack-400 italic">
                            Make this Course As Public
                        </span>
                    </label>
                </div>
                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button disabled={loading} type="button"
                    className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                    onClick={goBack}>
                        Back
                    </button>
                    <IconBtn disabled={loading} text="Save Changes" />
                </div>
            </form>
        </div>
    )
}

export default CoursePublishForm