import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../services/operations/courseAPI";
import { setCourse } from "../../../../slices/courseSlice";
import UploadWithPreview from "./UploadWithPreview";
import { toast } from "react-hot-toast";
import { RxCross1 } from "react-icons/rx";
import IconBtn from "../../../common/IconBtn";

const SubsectionModal= ({
    modalData, setModalData, add=false, view=false, edit=false
})=>{
    const {register,handleSubmit,setValue,getValues,formState:{errors}}= useForm();
    const dispatch= useDispatch();
    const [loading,setLoading]= useState(false);
    const {token}= useSelector((state)=>state.auth);
    const {course}= useSelector((state)=>state.course);

    useEffect(()=>{
        if (view || edit){
            setValue("lectureTitle",modalData.title);
            setValue("lectureDesc",modalData.description);
            setValue("lectureVideo",modalData.videoUrl);
        }
    },[]);

    const isFormUpdated= ()=>{
        const currentValues= getValues();
        if (currentValues.lectureTitle !== modalData.title ||
            currentValues.lectureDec !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl){
                return true;
            }
        else{
            return false;
        }
    }

    const submitHandler= async(data)=>{
        if (view){
            return;
        }
        if (edit){
            if (!isFormUpdated()){
                toast.error("No changes made");
            }
            else{
                handleEditSubsection();
            }
        }
        else{
            const formData= new FormData();
            formData.append("sectionId",modalData);
            formData.append("title",data.lectureTitle);
            formData.append("description",data.lectureDesc);
            formData.append("videoFile",data.lectureVideo);
            setLoading(true);
            // api call
            const response= await createSubSection(formData,token);
            if (response){
                const updatedCourseContent= course.courseContent.map((section)=>
                section._id===modalData?response: section);
                const updatedCourse= {...course,courseContent:updatedCourseContent};
                console.log("new course",updatedCourse);
                dispatch(setCourse(updatedCourse));
            }
            setModalData(null);
            setLoading(false);
        }
    }

    const handleEditSubsection=async()=>{
        const currentValues= getValues();
        const formData= new FormData();
        //console.log("got details",modalData);
        formData.append("sectionId",modalData.sectionId);
        formData.append("subSectionId",modalData._id);

        if (currentValues.lectureTitle !== modalData.title){
            formData.append("title",currentValues.lectureTitle);
        }
        if (currentValues.lectureDesc !== modalData.description){
            formData.append("description",currentValues.lectureDesc);
        }
        if (currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("videoFile", currentValues.lectureVideo);
        }

        setLoading(true);   
        const response= await updateSubSection(formData,token);
        if (response){
            const updatedCourseContent= course.courseContent.map((section)=>
            section._id===modalData.sectionId ?response: section);
            const updatedCourse= {...course,courseContent:updatedCourseContent};
            //console.log("updated coutse",updatedCourse);
            dispatch(setCourse(updatedCourse));
        }
        setModalData(null);
        setLoading(false);
    }
    
    return (
        <div className="fixed z-[1000] inset-0 !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg bg-richblack-800 border border-richblack-400">
                
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <p className="text-xl font-semibold text-richblack-5">
                        {view && "Viewing"} {add && "Adding"} {edit && "Editing"}
                        Lecture
                    </p>
                    <button onClick={()=>(!loading?setModalData(null):{})}>
                        <RxCross1 className="text-xl text-pink-200 font-semibold" />
                    </button>
                </div>
                    
                <form onSubmit={handleSubmit(submitHandler)}
                className="space-y-8 px-8 py-10">
                    <UploadWithPreview
                    name="lectureVideo"
                    id="lectureVideo"
                    label="Lecture Video"
                    register= {register}
                    setValue={setValue}
                    errors= {errors}
                    video= {true}
                    viewData={view?modalData.videoUrl:null}
                    editData={edit?modalData.videoUrl:null}
                    />

                    <div>
                        <label htmlFor="lectureTitle" className="label-style">Lecture Title</label>
                        <input className="input-style" 
                        disabled={view || loading}
                        id="lectureTitle" name="lectureTitle"
                        placeholder="Enter lecture title"
                        {...register("lectureTitle",{required:true})}
                        />
                        {
                            errors.lectureTitle && (
                                <span>
                                    Lecture title is required
                                </span>
                            )
                        }
                    </div>

                    <div>
                        <label htmlFor="labelDesc" className="label-style">
                            Lecture Description
                        </label>
                        <textarea  className="input-style"
                        disabled={loading || view}
                        id="lectureDesc" name="lectureDesc"
                        placeholder="Enter the description"
                        {...register("lectureDesc",{required:true})}
                        />
                        {
                            errors.lectureDesc && (
                                <span>
                                    Lecture Description is required
                                </span>
                            )
                        }
                    </div>

                    <div>
                        {
                            !view && (
                                <div>
                                    <IconBtn
                                    disabled={loading}
                                    text={loading? "Loading...":edit?"Save Changes": "Save"}
                                    />
                                </div>
                            )
                        }
                    </div>

                </form>
            </div>
        </div>
    )
}

export default SubsectionModal;