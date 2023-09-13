import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";

const EnrolledCourses= ()=>{
    const {token}= useSelector((state)=>state.auth)
    const [enrolledCourses,setEnrolledCourses]= useState(null);
    const navigate= useNavigate();

    const getEnrolledCourses= async()=>{
        try{
            const response= await getUserEnrolledCourses(token);
            console.log("got enrolled course res",response);
            setEnrolledCourses(response);
        }catch(error){
            console.log("error in fetching the enrolled courses")
        }
    }
    useEffect(()=>{
        getEnrolledCourses();
    },[])

    return (
        <div className="text-[#ff8a8a]">
            <h1 className="text-3xl text-richblack-50">
                Enrolled Courses
            </h1>
            <div>
                {
                    !enrolledCourses ? (<div className="grid place-items-center min-h-[calc(100vh-3.5rem)]">Loading...</div>)
                    : !enrolledCourses.length ?(
                        <p className="grid h-[10vh] w-full place-items-center text-richblack-5 italic">
                            You have not registered for any courses yet..
                        </p>
                    )
                    :(
                        <div className="my-8 text-richblack-5">
                            <div className="flex bg-richblack-500 rounded-t-lg">
                                <p className="w-[45%] px-5 py-3">
                                    Course Name
                                </p>
                                <p className="w-1/4 px-2 py-3">
                                    Duration
                                </p>
                                <p className="flex-1 px-2 py-3">
                                    Progress
                                </p>
                            </div>

                            {/* cards for the enrolled courses */}
                            {/* {console.log("enrolledCourse",enrolledCourses)} */}
                            {
                                
                                enrolledCourses.map((course,index, arr)=>{ 
                                    //console.log("enrolled course is-->",course);
                                    //console.log(`${course?.courseContent[0]}/sub-section/${course.courseContent?.[0][0]}`)
                                    //console.log(course?.courseContent[0]._id)
                                    return(
                                    <div key={index} className={`flex items-center border border-richblack-700 
                                    ${index===arr.length-1?"rounded-b-lg":"rounded-none"}`}>
                                        <div className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                        onClick={()=>{navigate(`/view-course/${course?._id}/section/${course?.courseContent[0]._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}}>
                                            <img src={course.thumbnail} alt={course.courseName}
                                             className="h-14 w-14 rounded-lg object-cover" />
                                            <div className="flex max-w-xs flex-col gap-2">
                                                <p className="font-semibold">{course.courseName}</p>
                                                <p className="text-xs text-richblack-300">
                                                    {
                                                        course.courseDescription.length >50 
                                                        ?`${course.courseDescription.slice(0,50)}...`
                                                        :course.courseDescription
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-1/4 px-2 py-3">
                                            {course?.totalDuration}
                                        </div>
                                        <div>
                                            <p>Progress:{course.progressPercentage || 0}%</p>
                                            {/* progress bar */}
                                            {console.log(course)}
                                            <ProgressBar completed={course.progressPercentage || 0} height="8px" isLabelVisible={false} />
                                        </div>
                                    </div>
                                )})
                            }
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default EnrolledCourses;