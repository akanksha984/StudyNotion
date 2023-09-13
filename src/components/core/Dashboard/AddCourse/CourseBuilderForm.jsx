import { useForm } from "react-hook-form";
import IconBtn from "../../../common/IconBtn";
import { useState } from "react";
import {MdAddCircleOutline, MdNavigateNext} from "react-icons/md"
import { useDispatch, useSelector } from "react-redux";
import { setEditCourse, setStep, setCourse } from "../../../../slices/courseSlice";
import { toast } from "react-hot-toast";
import { createSection, updateSection } from "../../../../services/operations/courseAPI";
import NestedView from "./NestedView";

const CourseBuilderForm= ()=>{
    const {
        register,
        setValue, handleSubmit,
        formState:{errors},
    }= useForm();
    const [editSectionName,setEditSectionName]= useState(null);
    const {course}= useSelector((state)=>state.course);
    const {token}= useSelector((state)=>state.auth);
    const [loading,setLoading]= useState(false);
    const dispatch= useDispatch();

    const cancelEdit= ()=>{
        setEditSectionName(null);
        setValue("sectionName","");
        return;
    }
    const goBack= ()=>{
        dispatch(setStep(1));
        // 1 se 2 par jayege toh edit karege
        dispatch(setEditCourse(true));
    }
    const goToNext= ()=>{
        console.log(course.courseContent);
        if (course.courseContent.length===0){
            toast.error("Please enter atleast one Section");
            return;
        }
        if (course.courseContent.some((section)=>section.subSection.length===0)){
            toast.error("Please atleast one video lecture in each section");
            return;
        }
        dispatch(setStep(3));
    }

    const submitHandler= async(data)=>{
        setLoading(true);
        let result;
        if (editSectionName){
            result= await updateSection({
                sectionName: data.sectionName,
                sectionId: editSectionName,
                courseId: course._id,
            },token)
        }
        else{
            result= await createSection({
                sectionName: data.sectionName,
                courseId: course._id,
            },token);
        }
        // update value
        if (result){
            dispatch(setCourse(result));
            setEditSectionName(null);
            setValue("sectionName","");
        }
        setLoading(false);
    }

    const handleChangeEditSectionName= (sectionId,sectionName)=>{
        if (editSectionName === sectionId){
            cancelEdit();
            return;
        }
        setEditSectionName(sectionId);
        setValue("sectionName",sectionName);
    }

    return (
        <div className="text-[#e38585] space-y-8 rounded-md bg-richblack-900 p-6 border-[1px] border-richblack-700">
            <p className="text-xl font-semibold text-richblack-5"> Course Builder</p>
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="sectionName" className="label-style">
                        Section Name <sup className="text-pink-200">*</sup>
                    </label>
                    <input id="sectionName" placeholder="Add section name"
                    {...register("sectionName",{required:true})}
                    className="input-style">
                    </input>
                    {
                        errors.sectionName && (
                            <span className="error-style">
                                Section Name is required
                            </span>
                        )
                    }                    
                </div>

                <div className="flex gap-x-4 items-end">
                    <IconBtn
                        type='submit'
                        disabled={loading}
                        text={editSectionName?"Edit Section Name":"Create Section"}
                        outline={true}
                        customClasses={"flex items-center justify-center"}
                    >
                        <MdAddCircleOutline className="font-semibold text-yellow-50" size={20} />
                    </IconBtn>
                    {
                        editSectionName && (
                            <button type='button' onClick={cancelEdit} 
                            className="text-sm text-richblack-300 underline ml-1">
                                Cancel Edit
                            </button>
                        )
                    }
                </div>
            </form>

            {/* nested sections subsections */}
            {
                course?.courseContent?.length>0 && (
                    <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
                )
            }
            <div className="flex gap-x-3 justify-end">
                <button onClick={goBack} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                    Back
                </button>
                <IconBtn text="Next" onClick={goToNext} >
                    <MdNavigateNext/>
                </IconBtn>
            </div>

        </div>
    )
}

export default CourseBuilderForm;