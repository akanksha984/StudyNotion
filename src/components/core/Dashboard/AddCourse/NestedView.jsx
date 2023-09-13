import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {RxDropdownMenu} from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import ConfirmationModal from "../../../common/confirmationModal"
import { AiFillCaretDown, AiOutlinePlus } from "react-icons/ai";
import SubsectionModal from "./SubsectionModal";
import { deleteSection, deleteSubSection } from "../../../../services/operations/courseAPI";
import { setCourse } from "../../../../slices/courseSlice";

const NestedView= ({handleChangeEditSectionName})=>{
    const {course}= useSelector((state)=>state.course);
    const {token}= useSelector((state)=>state.auth);
    const dispatch= useDispatch();
    const [addSubsection,setAddSubsection]= useState(null);
    const [editSubsection,setEditSubsection]= useState(null);
    const [viewSubsection,setViewSubsection]= useState(null);
    const [confirmationModal, setConfirmationModal]= useState(null);
    const handleDeleteSection= async(sectionId)=>{
        const result= await deleteSection({
            sectionId,
            courseId: course._id,
            token,
        })
        if(result){
            dispatch(setCourse(result));
        }
        setConfirmationModal(null);
    }
    const handleDeleteSubsection= async(subSectionId, sectionId)=>{
        const result= await deleteSubSection({subSectionId,sectionId,token});
        if (result){
            const updatedCourseContent= course.courseContent.map((section)=>
            section._id===sectionId ?result: section);
            const updatedCourse= {...course,courseContent:updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null); 
    }
    return (
        <div className="bg-richblack-800 rounded-lg p-6 px-8">
            <div>
                {
                    course?.courseContent?.map((section)=>(
                        <details key={section._id} open>
                            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                                <div className="flex items-center gap-x-3">
                                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                                    <p className="font-semibold text-lg text-richblack-25">{section.sectionName}</p>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <button onClick={()=>handleChangeEditSectionName(section._id,section.sectionName)}>
                                        <MdEdit className="text-xl text-richblack-300"/>
                                    </button>
                                    <button onClick={()=>{
                                        setConfirmationModal({
                                            text1: "Delete this section ?",
                                            text2: "All the lectures in this section will be deleted",
                                            btn1Text: "Delete",
                                            btn2Text: "Cancel",
                                            btn1Handler: ()=> handleDeleteSection(section._id),
                                            btn2Handler: ()=> setConfirmationModal(null),
                                        })
                                    }}>
                                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                    </button>
                                    <span className="text-xl text-richblack-300">
                                        |
                                    </span>
                                    <AiFillCaretDown className="text-xl text-richblack-300" />
                                </div>
                            </summary>

                            <div className="px-6 pb-4">
                                {   
                                    section?.subSection?.map((data)=>{
                                        //console.log("data",data)
                                        return <div key={data?._id}
                                        onClick={()=>setViewSubsection(data)}
                                        className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                                        >
                                            <div className="flex items-center gap-x-3 py-2">
                                                <RxDropdownMenu className="text-xl text-richblack-300" />
                                                <p className="font-semibold text-richblack-50">{data.title}</p>
                                            </div>

                                            {/* stop propagation taki upar wla onCLick is pe na work kare wrna hamesha view hi hoga */}
                                            <div
                                            onClick={(e)=>e.stopPropagation()}
                                            className="flex items-center gap-x-3"
                                            >
                                                <button onClick={()=>setEditSubsection({...data,sectionId:section._id})}>
                                                    <MdEdit className="text-xl text-richblack-300"/>
                                                </button>
                                                <button
                                                onClick={()=>setConfirmationModal({
                                                    text1: "Delete this lecture ?",
                                                    text2: "This lecture will be deleted",
                                                    btn1Text: "Delete",
                                                    btn2Text: "Cancel",
                                                    btn1Handler: ()=> handleDeleteSubsection(data._id,section._id),
                                                    btn2Handler: ()=> setConfirmationModal(null),
                                                })}>
                                                    <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                                                </button>
                                            </div>
                                        </div>
                                    })
                                }
                                <button 
                                onClick={()=>setAddSubsection(section._id)}
                                className="mt-3 flex items-center gap-x-1 text-yellow-50 border rounded-md px-2 py-1">
                                    <AiOutlinePlus/>
                                    <p>Add Lecture</p>
                                </button>
                            </div>

                        </details>
                    ))
                }
            </div>
            {
                addSubsection?  (<SubsectionModal modalData= {addSubsection} setModalData={setAddSubsection} add={true} />):
                viewSubsection? (<SubsectionModal modalData= {viewSubsection} setModalData={setViewSubsection} view={true}/>):
                editSubsection? (<SubsectionModal modalData= {editSubsection} setModalData={setEditSubsection} edit={true}/>):
                (<div></div>)
            }
            {
                confirmationModal && (
                    <ConfirmationModal modalData={confirmationModal} />
                )
            }
        </div>
    )
}

export default NestedView;