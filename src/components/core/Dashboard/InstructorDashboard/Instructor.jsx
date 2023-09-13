import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { fetchInstructorCourses } from '../../../../services/operations/courseAPI';
import { useSelector } from 'react-redux';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

const Instructor = () => {
    const {token}= useSelector((state)=>state.auth);
    const {user}= useSelector((state)=>state.profile);
    const [loading,setLoading]= useState(false);
    const [instructorData,setInstructorData]= useState([]);
    const [courses,setCourses]= useState([]);
    useEffect(()=>{
        const getCourseDataWithStats= async()=>{
            setLoading(true);
            const instructorApiData= await getInstructorData(token);
            const result= await fetchInstructorCourses(token);
            //console.log("instructorapi res--> ",instructorApiData);
           // console.log("instructor courses->", result);
           //console.log(instructorApiData.length);
            if(instructorApiData.length){
                setInstructorData(instructorApiData);
            }
            if (result){
                setCourses(result);
            }
            setLoading(false);
            //console.log(instructorApiData,"check heree",instructorData);
        }
        getCourseDataWithStats();
    },[]);

    //console.log("instructor data-> ",instructorData);
    const totalAmount= instructorData.reduce((acc,curr)=>acc+curr.totalAmountGenerated,0);
    const totalStudents= instructorData.reduce((acc,curr)=>acc+curr.totalStudentsEnrolled,0);

  return (
    <div>
        <div className='space-y-2'>
            <h1 className='text-2xl font-bold text-richblack-5'>Hii ! {user.firstName} {user.lastName}</h1>
            <p className='font-medium text-richblack-200 italic'>Let's start something new</p>
        </div>
        {
            loading ?
            (<div> Loading...</div>)
            : courses.length>0 ?(
                <div>
                    <div className='my-4 flex min-h-[450px] space-x-4'>
                        {
                            (totalAmount>0 || totalStudents>0)? (<InstructorChart courses={instructorData} />)
                            : (<div className="flex flex-col gap-y-2 p-4 border-2 border-richblack-700 rounded-md bg-richblack-800">
                                    <p className="text-2xl text-center font-bold text-richblack-5">
                                        Visualize
                                    </p>
                                    <p className='text-xl text-center italic mt-4 text-richblack-100'>
                                        Not Enough data to visualize...
                                    </p>
                                </div>)
                        }
                        
                        {/* Statistics section */}
                        <div className="flex min-w-[250px] flex-col bg-richblue-800 rounded-md border-2 border-richblack-700 p-6 align-center">
                            <p className='text-2xl text-center font-semibold text-richblack-5'>Statistics</p>
                            <div className='mt-4 space-y-4'>
                                <div>
                                    <p className='text-lg text-richblack-100 font-semibold'>Total Courses</p>
                                    <p className='text-2xl text-richblack-25 font-semibold'>{courses.length}</p>
                                </div>
                                <div>
                                    <p className='text-lg text-richblack-100 font-semibold'>Total Students</p>
                                    <p className='text-2xl text-richblack-25 font-semibold'>{totalStudents}</p>
                                </div>
                                <div>
                                    <p className='text-lg text-richblack-100 font-semibold'>Total Income</p>
                                    <p className='text-2xl text-richblack-25 font-semibold'>{totalAmount}</p>
                                </div>
                            </div>  
                            
                        </div>    
                    </div>
                    

                    {/* render my courses */}
                    <div className='rounded-md bg-richblack-800 border-2 border-richblack-700 p-6'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-2xl font-semibold text-richblack-5'>Your Courses</h1>
                            <Link to="/dashboard/my-courses">
                                <p className='text-yellow-50 text-sm font-semibold'>View All Courses {">>"}</p>
                            </Link>
                        </div>

                        {/* render 3 courses */}
                        <div className='my-4 flex space-x-6 items-start'>
                            {
                                courses.slice(0,3).map((course,index)=>{
                                    return (
                                        <div key= {index} className='w-1/3'>
                                            <img src={course.thumbnail} alt={course.courseName}
                                            className='h-[201px] w-full rounded-md object-cover' />
                                            <div className='mt-3 w-full'>
                                                <p className='text-richblack-25 text-md font-semibold'>{course.courseName}</p>
                                                <div className='flex text-richblack-300 mt-1 items-center space-x-2 text-sm font-medium'>
                                                    <p>Rs. {course.price}</p>
                                                    <p> | </p>
                                                    <p>{course.studentsEnrolled.length} Student{course.studentsEnrolled.length!==1 && (<span>s</span>)}</p>    
                                                </div>
                                            </div>    
                                            
                                        </div>
                                    )
                                })
                            }
                        </div>
                        
                    </div>
                </div>
            )
            :(
                <div className='mt-20 rounded-md bg-richblack-800 border-2 border-richblack-700 p-6 py-20'>
                    <p className='text-lg text-center italic text-richblack-200'>You have not created any course yet...</p>
                    <Link to="/dashboard/addCourse">
                        <p className='mt-1 text-yellow-50 font-semibold text-center text-lg'>
                           Create A Course 
                        </p>
                        
                    </Link>
                </div>
            )
        }
    </div>
  )
}

export default Instructor