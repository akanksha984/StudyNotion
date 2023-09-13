import { useEffect, useRef, useState } from "react";
import { BiTrendingUp } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { markLectureAsComplete } from "../../../services/operations/courseAPI";
import { BigPlayButton, Player } from "video-react";
import 'video-react/dist/video-react.css';
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from "../../common/IconBtn";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";

const VideoDetails= ()=>{
    const {courseId,sectionId,subsectionId}= useParams();
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const location= useLocation();
    const playerRef= useRef(null);
    const {token}= useSelector((state)=>state.auth);
    const {courseSectionData, courseEntireData, completedLectures}= useSelector((state)=>state.viewCourse);
    const [videoData,setVideoData]= useState("");
    const [videoEnded,setVideoEnded]= useState(false);
    const [loading,setLoading]= useState(false);
    const [previewSource,setPreviewSource]= useState("");

    useEffect(()=>{
        const setVideoSpecificDetails= async()=>{
            if (!courseSectionData.length){
                return;
            }
            if (!courseId || !sectionId || !subsectionId){
                navigate("/dashboard/enrolled-courses");
            }
            else{
                // display the data
                const filteredData= courseSectionData.filter(
                    (sec)=> sec._id === sectionId
                )
                const filterVideoData= filteredData[0].subSection.filter(
                    (data)=> data._id===subsectionId
                )
                setPreviewSource(courseEntireData.thumbnail);
                setVideoData(filterVideoData[0]);
                setVideoEnded(false);
            }
        }
        setVideoSpecificDetails();
    },[courseSectionData,courseEntireData,location.pathname]);

    const isFirstVideo= ()=>{
        const currentSectionIndex= courseSectionData.findIndex(
            (data)=>data._id===sectionId
        )
        const currentSubsectionIndex= courseSectionData[currentSectionIndex].subSection.findIndex(
            (data)=> data._id===subsectionId
        )
        if (currentSectionIndex===0 && currentSubsectionIndex===0){
            return true;
        }
        else{
            return false;
        }
    }
    const isLastVideo= ()=>{
        const currentSectionIndex= courseSectionData.findIndex(
            (data)=> data._id===sectionId
        )
        const currentSubsectionIndex= courseSectionData[currentSectionIndex].subSection.findIndex(
            (data)=> data._id===sectionId
        )
        const noOfSubsections= courseSectionData[currentSectionIndex].subSection.length;
        if (currentSectionIndex===courseSectionData.length-1 && currentSubsectionIndex===noOfSubsections-1){
            return true;
        }
        else{
            return false;
        }
    }
    const gotToNextVideo= ()=>{
        const currentSectionIndex= courseSectionData.findIndex(
            (data)=> data._id===sectionId
        )
        const currentSubsectionIndex= courseSectionData[currentSectionIndex].subSection.findIndex(
            (data)=> data._id===subsectionId
        )
        const noOfSubsections= courseSectionData[currentSectionIndex].subSection.length;

        // more lecture in same section , go to next video in same section
        if (currentSubsectionIndex!== noOfSubsections-1){
            const nextSubsectionId= courseSectionData[currentSectionIndex].subSection[currentSubsectionIndex+1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubsectionId}`);
        }
        // go to next section first video
        else{
            const nextSectionId= courseSectionData[currentSectionIndex+1]._id;
            const nextSubsectionId= courseSectionData[currentSectionIndex+1].subSection[0]._id;
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`);
        }
    }
    const goToPreviousVideo= ()=>{
        const currentSectionIndex= courseSectionData.findIndex(
            (data)=> data._id===sectionId
        )
        const currentSubsectionIndex= courseSectionData[currentSectionIndex].subSection.findIndex(
            (data)=> data._id===subsectionId
        )

        // more lecture above in same section , go to previous video in same section
        if (currentSubsectionIndex!== 0){
            const previousSubsectionId= courseSectionData[currentSectionIndex].subSection[currentSubsectionIndex-1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${previousSubsectionId}`);
        }
        // go to back section last video
        else{
            const previousSectionId= courseSectionData[currentSectionIndex-1]._id;
            const prevSubsectionLength= courseSectionData[currentSectionIndex-1].subSection.length
            const previousSubsectionId= courseSectionData[currentSectionIndex-1].subSection[prevSubsectionLength-1]._id;
            navigate(`/view-course/${courseId}/section/${previousSectionId}/sub-section/${previousSubsectionId}`);
        }
    }
    const handleLectureCompletion= async()=>{
        setLoading(true);
        const res= await markLectureAsComplete({courseId:courseId, subsectionId:subsectionId},token);
        // update the state
        if (res){
            dispatch(updateCompletedLectures(subsectionId));
        }
        setLoading(false);
    }
    return (
        <div className="flex flex-col gap-5 text-white">
            {
                !videoData ? (<div>
                    <img src={previewSource} alt="Preview" className="h-full w-full rounded-md object-cover" />
                </div>)
                :(
                    <>
                        <Player ref={playerRef} aspectRatio="16:9" playsInline onEnded={()=>setVideoEnded(true)} src={videoData.videoUrl}>
                            <BigPlayButton position="center" />
                            {/* <AiFillPlayCircle position="center" /> */}
                            {
                                videoEnded && (
                                    <div 
                                    style={{backgroundImage:"linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",}}
                                    className="full absolute inset-0 z-[100] grid f-hull place-content-center font-inter"
                                        >
                                        {
                                            !completedLectures.includes(subsectionId) && (
                                                <IconBtn text={!loading? "Mark as completed":"Loading..."} disabled={loading} onClick={()=>handleLectureCompletion()}
                                                customClasses="text-xl max-w-max px-4 mx-auto" />
                                            )
                                        }
                                        <IconBtn disabled={loading} onClick={()=>{
                                            if (playerRef.current){
                                                playerRef.current.seek(0);
                                                setVideoEnded(false);
                                            }
                                        }} text="Watch Again"
                                        customClasses="text-xl max-w-max px-4 mx-auto mt-2" />
                                        <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                                            {
                                                !isFirstVideo() && (
                                                    <button
                                                        disabled={loading} onClick={goToPreviousVideo} className="black-button" >
                                                            Previous
                                                    </button>
                                                )
                                            }
                                            {
                                                !isLastVideo() && (
                                                    <button
                                                    disabled={loading} onClick={gotToNextVideo} className="black-button">
                                                        Next
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </Player>
                        <div>
                            <h1 className="mt-4 text-3xl font-semibold">
                                {videoData.title}
                            </h1>
                            <p className="pt-2 pb-6 text-richblack-100 italic">
                                {videoData.description}
                            </p>
                        </div>    
                    </>
                )
            }
        </div>
    )
}

export default VideoDetails;