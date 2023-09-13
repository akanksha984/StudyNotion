import { useState } from "react";
import HighlightText from "./HighlightText";
import {HomePageExplore} from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";

const tabsName= [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skill Paths",
    "Career Paths"
];
const ExploreMore= ()=>{
    const [currentTab,setCurrentTab]= useState(tabsName[0]);
    const [courses,setCourses]= useState(HomePageExplore[0].courses);
    const [currentCard,setCurrentCard]= useState(HomePageExplore[0].courses[0].heading);

    const setMyCards =(value)=>{
        setCurrentTab(value);
        const result= HomePageExplore.filter((course)=>course.tag===value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading)
    }

    return (
        <div className="flex flex-col">
            <div className="text-4xl font-semibold text-center">
                Unlock the
                <HighlightText text="Power of Code" />
            </div>
            <p className="text-center text-richblack-300 text-[16px] mt-3">
                Learn to build anything you imagine
            </p>
            <div className="flex flex-row rounded-full bg-richblue-800 mb-5 mt-5 px-1 py-1 border-richblack-100">
                {
                tabsName.map((element,index)=>{
                    return (
                        <div key={index} className={`text-[16px] flex flex-row gap-2 items-center
                        ${currentTab===element ? "bg-richblack-900 text-richblack-5 font-medium":"text-richblack-200"}
                        rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                        onClick= {()=> setMyCards(element)}
                        >
                            {element}
                        </div>
                    )
                })
                }
            </div>
            <div className="h-[150px]"></div>
            <div className="absolute flex flex-row gap-10 justify-between w-full">
                {
                    courses.map((element,index)=>{
                        return (
                            <CourseCard key={index} cardData={element} currentCard={currentCard} setCurrentCard={setCurrentCard} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ExploreMore;