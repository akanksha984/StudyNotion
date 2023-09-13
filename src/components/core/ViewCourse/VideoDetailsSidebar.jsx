import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import {IoIosArrowBack} from "react-icons/io"
import { BiSolidChevronDown } from "react-icons/bi";

const VideoDetailsSidebar= ({setReviewModal})=>{
    const [activeSection, setActiveSection]= useState("");
    const [videobarActive, setVideobarActive]= useState("");
    const navigate= useNavigate();
    const location= useLocation();
    const {sectionId, subsectionId}= useParams();
    const {courseEntireData,courseSectionData,totalNumberOfLectures,completedLectures}= useSelector((state)=>state.viewCourse);
    //console.log(sectionId,subsectionId, "got from params--<");
    useEffect(()=>{
        // another way of call the function created 
        ;(()=>{
            if (!courseSectionData.length){
                return;
            }
            const currentSectionIndex= courseSectionData.findIndex(
                (data)=> data._id === sectionId
            );
            const currentSubsectionIndex= courseSectionData[currentSectionIndex].subSection.findIndex(
                (data)=> data._id===subsectionId
            );
            const activeSubsectionId= courseSectionData[currentSectionIndex]?.subSection[currentSubsectionIndex]._id;
            console.log("indices milne ke baad !!!!!!!!!!")
            // set current section and subsection
            console.log("set sec wla->",courseSectionData[currentSectionIndex]._id)
            setActiveSection(courseSectionData[currentSectionIndex]._id);
            setVideobarActive(activeSubsectionId)
        })();
    },[courseSectionData,courseEntireData,location.pathname])
    /* console.log("gotta",courseEntireData); */
    return (
        <div className="flex h-[calc(100vh)-3.5rem] w-[320px] max-w-[350px] flex-col border-r-2 border-richblack-700 bg-richblack-800">
            <div className="mx-5 flex flex-col justify-between gap-2 gap-y-4 border-b border-b-richblack-600 py-5 text-lg font-bold text-richblack-25">
                {/* buttons and headings */}
                <div>
                    <div className="flex justify-between w-full items-center">
                        <div onClick={()=>navigate("/dashboard/enrolled-courses")}
                        className="flex items-center justify-center rounded-md bg-richblack-300 px-4 py-2 text-richblack-900 hover:scale-90 cursor-pointer transition duration-200">
                           <IoIosArrowBack size={25} />
                            Back
                        </div>
                        <IconBtn text="Add Review" onClick={()=>setReviewModal(true)} />
                    </div>
                    <div className="flex flex-col mt-5">
                        <p className="text-richblack-5 font-bold text-xl">{courseEntireData.courseName}</p>
                        <p className="text-richblack-200 font-semibold text-sm italic">Completed <span className="text-yellow-100">{completedLectures.length}</span> out of <span className="text-yellow-100">{totalNumberOfLectures}</span> Lectures</p>
                    </div>
                </div>

                {/* sections and subsection */}
                <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
                    {
                        courseSectionData.map((section,index)=>(
                            <div key={index}
                            onClick={()=>{
                                if (section._id === activeSection){
                                    setActiveSection(null)
                                }
                                else{
                                    setActiveSection(section._id)
                                }
                            }}
                            className="mt-2 cursor-pointer text-md text-richblack-5">
                                {/* sections */}
                                <div className="flex flex-row justify-between items-center bg-richblack-600 px-5 py-4">
                                    <div className="w-[70%] font-semibold">
                                        {section.sectionName}
                                    </div>
                                    <div className={`${activeSection!==section._id?"rotate-0":"rotate-180"} transition-all duration-200`}>
                                        <BiSolidChevronDown/>
                                    </div>
                                </div>

                                {/* subsections */}
                                {
                                    <div>
                                    {
                                        activeSection===section._id && (
                                            <div className="transition-[height] duration-500 ease-in-out">
                                                {
                                                    section.subSection.map((subsec,index)=>{
                                                        return (<div key= {index}
                                                        className={`flex gap-3 px-5 py-2 items-center
                                                        ${videobarActive===subsec._id?"bg-yellow-200 text-richblack-800 font-semibold rounded-b-md":"hover:bg-richblack-900 text-white rounded-md"}`}
                                                        onClick={()=>{
                                                            // navigate to that subsection
                                                            navigate(`/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${subsec._id}`)
                                                            // make the video bar active
                                                            setVideobarActive(subsec._id)
                                                        }}>
                                                            <input 
                                                            type="checkbox"
                                                            checked={completedLectures.includes(subsec._id)}
                                                            className="checkbox-style"
                                                            onChange={()=>{}}
                                                            />
                                                            <span>{subsec.title}</span>
                                                        </div>)
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                </div>}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default VideoDetailsSidebar;