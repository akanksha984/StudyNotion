import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { fetchCourseCategories, addCourseDetails, editCourseDetails } from "../../../../services/operations/courseAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import RequirementField from "./RequirementField";
import IconBtn from "../../../common/IconBtn";
import {setStep,setCourse} from "../../../../slices/courseSlice"
import {COURSE_STATUS} from "../../../../utils/constant";
import { toast } from "react-hot-toast";
import ChipInput from "./ChipInput";
import UploadWithPreview from "./UploadWithPreview";
import {MdNavigateNext} from "react-icons/md";

const CourseInformationForm=()=>{
    const {register, handleSubmit, setValue, getValues, formState:{errors}} = useForm();
    const dispatch= useDispatch();
    const {course,editCourse}= useSelector((state)=>state.course);
    const [loading,setLoading]= useState(false);
    const [courseCategory,setCourseCategory]= useState([]);
    const {token}= useSelector((state)=>state.auth)

    useEffect(()=>{
        const getCategories= async()=>{
            setLoading(true);
            const categories= await fetchCourseCategories();
            if (categories.length > 0){
                setCourseCategory(categories);
            }
            //console.log("course categories->",categories);
            setLoading(false);
        }

        if (editCourse){
            setValue("courseTitle",course.courseName);
            setValue("courseShortDesc",course.courseDescription);
            setValue("coursePrice",course.price);
            setValue("courseTags",course.tag);
            setValue("courseBenefits",course.whatYouWillLearn);
            setValue("courseCategory",course.category);
            setValue("courseRequirements",course.instructions);
            setValue("courseImage",course.thumbnail);
        }

        getCategories();
    },[]);
 
    const isFormUpdated= ()=>{
        const currentValues= getValues();
        if (
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
          ) {      
            return true;
        }
        else{
            return false;
        }

    }

    // next/save button function
    const submitHandler= async(data)=>{
        if (editCourse){    // editing/updating course
            if (isFormUpdated()){
                const currentValues = getValues()
                const formData = new FormData()
                // console.log(data)
                formData.append("courseId", course._id)
                if (currentValues.courseTitle !== course.courseName) {
                  formData.append("courseName", data.courseTitle)
                }
                if (currentValues.courseShortDesc !== course.courseDescription) {
                  formData.append("courseDescription", data.courseShortDesc)
                }
                if (currentValues.coursePrice !== course.price) {
                  formData.append("price", data.coursePrice)
                }
                if (currentValues.courseTags.toString() !== course.tags.toString()) {
                  formData.append("tags", JSON.stringify(data.courseTags))
                }
                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                  formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                  formData.append("category", data.courseCategory)
                }
                if (
                  currentValues.courseRequirements.toString() !==
                  course.instructions.toString()
                ) {
                  formData.append(
                    "instructions",
                    JSON.stringify(data.courseRequirements)
                  )
                }
                if (currentValues.courseImage !== course.thumbnail) {
                  formData.append("thumbnailImage", data.courseImage)
                }
                setLoading(true);
                const result= await editCourseDetails(formData,token);
                setLoading(false);
                if (result){
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
            }
            else{
                toast.error("No changes made to save !")
            }
        }
        else{   // creating course
            const formData = new FormData();
            formData.append("courseName", data.courseTitle);
            formData.append("courseDescription", data.courseShortDesc);
            formData.append("price", data.coursePrice);
            formData.append("tag", JSON.stringify(data.courseTags));
            formData.append("whatYouWillLearn", data.courseBenefits);
            formData.append("category", data.courseCategory);
            formData.append("status", COURSE_STATUS.DRAFT);
            formData.append("instructions", JSON.stringify(data.courseRequirements));
            formData.append("thumbnailImage", data.courseImage);
            //console.log("course desc passed ",data.courseShortDesc)
            setLoading(true);
            const result = await addCourseDetails(formData, token);
            if (result) {
                dispatch(setStep(2));
                dispatch(setCourse(result));
            }
            setLoading(false);
        }
    }
   
    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-8 border-[1px] border-richblack-700 rounded-md bg-richblack-900 p-6">
            <div className="flex flex-col space-y-2">
                <label htmlFor="courseTitle" className="label-style">Course Title <sup className="text-pink-200">*</sup></label>
                <input name="courseTitle" id="courseTitle" placeholder="Enter the Course Title"
                {...register("courseTitle",{required:true})}
                className="input-style"
                ></input>
                {
                    errors.courseTitle && (
                        <span className="error-style">
                            Course title is mandatory
                        </span>
                    )
                }
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="courseShortDesc" className="label-style">Course Short Description <sup className="text-pink-200">*</sup></label>
                <input name="courseShortDesc" id="courseShortDesc" placeholder="Enter a short description"
                {...register("courseShortDesc",{required:true})}
                className="input-style min-h-[130px] placeholder:align-top"
                ></input>
                {
                    errors.courseShortDesc && (
                        <span className="error-style">
                            A short description of course is required
                        </span>
                    )
                }
            </div>
            <div className="relative">
                <label htmlFor="coursePrice" className="label-style">Course Price <sup className="text-pink-200">*</sup></label>
                <input name="coursePrice" id="coursePrice" placeholder="Enter the price"
                {...register("coursePrice",{required:true})}
                className="input-style placeholder:pl-8"
                ></input>
                {
                    errors.coursePrice && (
                        <span className="error-style">
                            The price of course is required
                        </span>
                    )
                }
                <HiOutlineCurrencyRupee className="text-2xl absolute top-1/2 left-3 text-richblack-200 inline-block -translate-y-[2px]" />
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="courseCategory" className="label-style">Course Category <sup className="text-pink-200">*</sup></label>
                <select id='courseCategory' defaultValue=""
                {...register("courseCategory",{required:true})}
                className="input-style pl-12 cursor-pointer">
                    <option value="" disabled className="input-style cursor-pointer">Choose a category</option>
                    {
                        !loading && courseCategory.map((category,index)=>(
                            <option key={index} value={category?._id} className="input-style cursor-pointer">
                                {category?.name}
                            </option>
                        ))
                    }

                </select>
                {
                    errors.courseCategory && (
                        <span className="error-style">
                            Course Category is required
                        </span>
                    )
                }
            </div>

            {/* custom component for handling tag input */}
            <ChipInput
            label="Tags" name="courseTags"
            placeholder="Enter you tags and press Enter"
            register={register} errors= {errors}
            setValue={setValue} getValues={getValues}
            />

            {/* upload and preview media component */}
            <UploadWithPreview
            name="courseImage" label="Course Thumbnail"
            register={register} errors={errors}
            setValue={setValue} getValues={getValues}
            editData= {editCourse? course?.thumbnail : null}
            />

            <div className="flex flex-col space-y-2">
                <label htmlFor="courseBenefits" className="label-style">Benefits of the course <sup className="text-pink-200">*</sup></label>
                <textarea name="courseBenefits" id="courseBenefits" placeholder="Enter the benefits of the course"
                {...register("courseBenefits",{required:true})}
                className="input-style min-h-[120px]"
                />
                {
                    errors.courseBenefits && (
                        <span className="error-style">
                            Benefits of the course is required
                        </span>
                    )
                }
            </div>

            {/* requirements field component */}
            <RequirementField
            name="courseRequirements" label="Requirements/Instructions"
            register={register} errors={errors}
            setValue={setValue} getValues={getValues}
            />
            <div className="flex gap-x-2 justify-end">
             {
                editCourse && (
                    <button
                    onClick={()=>dispatch(setStep(2))}
                    disabled={loading}
                    className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                    >
                        Continue Without Saving
                    </button>
                )
            }
            <IconBtn
                text={!editCourse?"Next":"SaveChanges"}
            >
                <MdNavigateNext/>    
            </IconBtn>  
            </div>
            
        </form>
    )
}

export default CourseInformationForm

