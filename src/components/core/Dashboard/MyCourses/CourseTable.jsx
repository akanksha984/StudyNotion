import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table,Thead, Tr, Td,Th, Tbody } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import ConfirmationModal from "../../../common/confirmationModal";
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseAPI";
import {formattedDate} from "../../../../utils/dateFormat";
import {COURSE_STATUS} from "../../../../utils/constant";
import { useNavigate } from "react-router-dom";
import {HiClock} from "react-icons/hi";
import {FaCheck} from "react-icons/fa";
import {FiEdit2} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";

const CourseTable= ({courses,setCourses})=>{
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const {token}= useSelector((state)=>state.auth);
    const [loading,setLoading]= useState(false);
    const [confirmationModal,setConfirmationModal]= useState(null);
    const truncate= 30;

    const handleCourseDelete= async(courseId)=>{
        setLoading(true);
        await deleteCourse({courseId},token);
        const result= await fetchInstructorCourses(token);
        if (result){
            setCourses(result);
        }
        setConfirmationModal(null);
        setLoading(false);
    }
    
    return (
        <div className="text-pink-100">
            <Table className="border border-richblack-700 rounded-xl">
                <Thead>
                    <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-700 px-6 py-2">
                        <Th className="flex text-left text-sm font-medium uppercase text-richblack-5">
                            Course
                        </Th>
                        <Th className="flex text-left text-sm font-medium uppercase text-richblack-5">
                            Duration
                        </Th>
                        <Th className="flex text-left text-sm font-medium uppercase text-richblack-5">
                            Price
                        </Th>
                        <Th className="flex text-left text-sm font-medium uppercase text-richblack-5">
                            Actions
                        </Th>   
                    </Tr>
                    
                </Thead>
                <Tbody>
                    {
                        courses.length === 0 ?
                        (<Tr>
                            <Td className="py-10 text-center text-2xl font-medium text-richblack-100 italic">
                                No Courses Found
                            </Td>
                        </Tr>)
                        :(
                            courses.map((course)=>{
                                //console.log("course is->",course)
                                return (
                                    <Tr key={course._id} className="flex gap-x-10 border-b border-richblack-700 px-6 py-8">
                                        <Td className="flex flex-1 gap-x-4">
                                            <img src={course?.thumbnail} alt={course.courseName} className="h-[148px] w-[220px] rounded-lg object-cover" />
                                            <div className="flex flex-col justify-between">
                                                <p className="text-lg text-richblack-5 font-semibold">{course.courseName}</p>
                                                <p className="text-xs text-richblack-200">
                                                    {course.courseDescription.split(" ").length>truncate?course.courseDescription.split(" ").slice(0,truncate).join(" ")+"..."
                                                    :course.courseDescription}
                                                    </p>
                                                <p className="text-sm text-richblack-100"> Created On: {formattedDate(course.createdAt)} </p>
                                                {
                                                    course.status === COURSE_STATUS.DRAFT?(
                                                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-3 py-[4px] text-[12px] text-pink-100 font-semibold">
                                                            <HiClock size={14} />
                                                            Drafted
                                                        </p>
                                                    ):(
                                                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700  px-3 py-[4px] text-[12px] text-caribbeangreen-200 font-semibold">
                                                            <FaCheck size={8} />
                                                            Published
                                                        </p>
                                                    )
                                                }
                                            </div>
                                        </Td>
                                        <Td className="text-sm font-medium text-richblack-100">
                                            2h 30min
                                        </Td>
                                        <Td className="text-sm font-medium text-richblack-100">
                                            Rs. {course.price}
                                        </Td>
                                        <Td className="text-sm font-medium text-richblack-100">
                                            <button disabled={loading}
                                            onClick={()=>{
                                                navigate(`/dashboard/edit-course/${course._id}`)
                                            }}
                                            title="Edit"
                                            className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                                            >
                                                <FiEdit2 size={20} />
                                            </button>
                                            <button disabled={loading}
                                            onClick={()=>{
                                                setConfirmationModal({
                                                    text1: "Do You want to delete this course",
                                                    text2: "All the data related to this course will be deleted permanently",
                                                    btn1Text: !loading?"Delete":"Loading",
                                                    btn2Text: "Cancel",
                                                    btn1Handler:!loading? ()=>handleCourseDelete(course._id):()=>{} ,
                                                    btn2Handler: !loading?()=>setConfirmationModal(null):()=>{},
                                                })
                                            }}
                                            title="Delete"
                                            className="px-2 transition-all duration-200 hover:scale-110 hover:text-pink-300"
                                            >
                                                <RiDeleteBin6Line size={20} />
                                            </button>
                                        </Td>
                                    </Tr>
                                )
                            })
                        )
                    }
                </Tbody>
            </Table>
            {
                confirmationModal && <ConfirmationModal modalData={confirmationModal}></ConfirmationModal>
            }
        </div>
    )
}

export default CourseTable;