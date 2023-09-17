import * as Icon1 from "react-icons/bi";
import * as Icon2 from "react-icons/hi2";
import * as Icon3 from "react-icons/io5";

const contactDetails=[
    {
        icon: "HiChatBubbleLeftRight",
        heading: "Chat with us",
        description: "Friendly team is here to help",
        details: "info@studynotion.com",
    },
    {
        icon: "BiWorld",
        heading:"Visit Us",
        description: "Come and say hello at our office",
        details: "IIITBhagalpur"
    },
    {
        icon: "IoCall",
        heading: "Call us",
        description: "Mon-Fri from 10am to 6pm",
        details: "+123456789",
    }
];

const Contactdetails= ()=>{
    return (
        <div className="flex flex-col gap-6 bg-richblack-800 rounded-xl p-4 lg:p-6">
            {
                contactDetails.map((ele,index)=>{
                    let Icon= Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon];
                    return (
                        <div key={index}
                        className="flex flex-col gap-[2px] p-3 text-sm text-richblack-200">
                            <div className="flex flex-row items-center gap-3">
                                <Icon size={25} />
                                <h1 className="text-lg font-semibold text-richblack-5">
                                    {ele?.heading}
                                </h1>
                            </div>
                            <p className="font-medium">{ele?.description}</p>
                            <p className="font-semibold">{ele?.details}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Contactdetails;