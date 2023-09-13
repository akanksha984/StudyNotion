import Button from "../HomePage/Button";
import HighlightText from "../HomePage/HighlightText";

const learningGridArray= [
    {
        order: -1,
        heading: "World-Class Learning for",
        highlightedText: "Anyone, Anywhere",
        description: "Studynotion partners with more then 275+ leading universities and companies to bring flexible, affordable, job-relevant online-learning to individuals and organizations worldwide.",
        BtnText: "Learn More",
        BtnLink: "/",
    },
    {
        order: 1,
        heading: "Curriculum based on industry needs",
        description: "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs",
    },
    {
        order: 2,
        heading: "Our Learning Methods",
        description:"Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 3,
        heading: "Certification",
        description:"Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 4,
        heading: "Auto-growing",
        description:"Studynotion partners with more than 275+ leading universities and companies to bring",
    },
    {
        order: 5,
        heading: "Ready to Work",
        description:"Studynotion partners with more than 275+ leading universities and companies to bring",
    },
];
const LearningGrid= ()=>{
    return(
        <div className="grid mx-auto w-[350px] md:w-fit grid-cols-1 lg:grid-cols-4 mb-12">
            {
                learningGridArray.map((element,index)=>{
                    return (
                        <div key={index}
                        className={`${index===0 && "xl:col-span-2"}
                        ${element.order%2===1 ? "bg-richblack-700 max-h-[294px]":"bg-richblack-800 max-h-[294px]"}
                        ${element.order===3 && "lg:col-start-2 max-h-[294px]"}
                        ${element.order<0 && "bg-transparent"}`}
                        >
                            {
                                element.order<0
                                ?(
                                    <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                                       <div className="text-4xl font-semibold">
                                            {element.heading}
                                            <HighlightText text={element.highlightedText} />
                                        </div>
                                        <p className="text-richblack-300 font-medium">
                                            {element.description}
                                        </p>
                                        <div className="w-fit mt-2">
                                            <Button active={true} linkto={element.BtnLink}>
                                                {element.BtnText}
                                            </Button>
                                        </div> 
                                    </div>
                                )
                                :(
                                    <div className="p-8 flex flex-col gap-8">
                                        <div className="text-richblack-5 text-lg">
                                            {element.heading}
                                        </div>
                                        <p className="text-richblack-300 font-medium">
                                            {element.description}
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                    )
                })                
            }

        </div>
    )
}
export default LearningGrid;