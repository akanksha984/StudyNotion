import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../../services/operations/courseAPI";
import IconBtn from "../../../common/IconBtn";
import CourseTable from "./CourseTable";
import {VscAdd} from "react-icons/vsc"

const MyCourses= ()=>{
    const {token}= useSelector((state)=>state.auth);
    const navigate= useNavigate();
    const [courses,setCourses]= useState([]);
    useEffect(()=>{
        const fetchCourses= async()=>{
            const result= await fetchInstructorCourses(token);
            if(result){
                //console.log("from api got res=>",result);
                setCourses(result);
            }
        }
        fetchCourses();
    },[])
    return (
        <div>
            <div className="mb-14 flex item-center justify-between">
                <h1 className="text-2xl text-richblack-5 font-bold"> My Courses</h1>
                <IconBtn text="Add Course"
                onClick={()=>navigate("/dashboard/add-course")} >
                    <VscAdd />
                </IconBtn>
            </div>
            {
                courses && <CourseTable courses={courses} setCourses={setCourses} />
            }
        </div>
    )
}

export default MyCourses