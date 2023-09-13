import RenderSteps from "./RenderSteps";

const AddCourse= ()=>{
    return(
        <div className="flex w-full items-start gap-x-6">
            <div  className="flex flex-col flex-1">
                <h1 className="text-3xl mb-14 text-richblack-5 font-medium"> Add Course </h1>
                <div className="flex-1">
                    <RenderSteps/>
                </div>
            </div>
            <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border-richblack-700 border-[1px] bg-richblack-800 p-6 lg:block">
                <p className="mb-8 text-lg text-richblack-5">Code Upload Tips</p>
                <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
                    <li>
                        Set the Course Price option or make it free
                    </li>
                    <li>
                        Standard size for the course thumbnail is 1024x576
                    </li>
                    <li>
                        Video section controls the course overview video
                    </li>
                    <li>
                       Course Builder is where you create & oraganize a course
                    </li>
                    <li>
                        Add topics in cOurse Builder section to create lessons, quizzes and assignments
                    </li>
                    <li>
                        Information from the Additional data section shows up on the course single page.
                    </li>
                    <li>
                        Make Announcements to notify any important updates
                    </li>
                    <li>
                        Notes to all enrolled students at once
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AddCourse;