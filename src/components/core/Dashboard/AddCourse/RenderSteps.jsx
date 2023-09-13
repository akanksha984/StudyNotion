import { useSelector } from "react-redux";
import {FaCheck} from "react-icons/fa";
import CourseInformationForm from "./CourseInformationForm";
import CourseBuilderForm from "./CourseBuilderForm"
import CoursePublishForm from "./CoursePublishForm";

const RenderSteps= ()=>{
    const steps= [
        {
            id:1,
            title: "Course Information"
        },
        {
            id:2,
            title: "Course Builder"
        },
        {
            id: 3,
            title: "Publish"
        }
    ];

    const {step}= useSelector((state)=>(state.course))

    return(
        <div>
            {/* label number */}
            <div className="relative mb-2 flex w-full justify-center">
            {
                steps.map((item)=>(
                    <>
                        <div key={item.id} className="flex flex-col items-center">
                            <div
                            className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px]
                            ${step===item.id?"bg-yellow-900 border-yellow-50 text-yellow-50":"border-richblack-700 bg-richblack-800 text-richblack-300"}
                            ${step>item.id && "bg-yellow-50 text-yellow-50"}`}>
                            {
                                step>item.id ? (<FaCheck className="font-bold text-richblack-900"/>):(item.id)
                            }
                            </div>
                        </div>

                        {/* div for dotted line  */}
                        
                        {item.id !== steps.length && (
                            <>
                                <div className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 
                                ${step>item.id?"border-yellow-50":"border-richblack-500"}`}>
                                </div>
                            </>
                        )}
                    </>
                ))
            }
            </div>
            
            {/* label names */}
            <div className="relative mb-16 flex w-full select-none justify-between">
                {
                    steps.map((item)=>(
                        <div id={item.id} className="flex min-w-[130px] flex-col items-center gap-y-2">
                            <p className={`text-sm ${step>=item.id?"text-richblack-5":"text-richblack-500"}`}>{item.title}</p>
                        </div>
                    ))
                }
            </div>
            
            {/* form */}
            {step===1 && <CourseInformationForm/>}
            {step===2 && <CourseBuilderForm/>}
            {step===3 && <CoursePublishForm/>}
        </div>
    )
}

export default RenderSteps;