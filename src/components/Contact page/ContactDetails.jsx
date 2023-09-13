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
        <div>
            {
                contactDetails.map((ele,index)=>{
                    let Icon= Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon];
                    return (
                        <div key={index}>
                            <div>
                                <Icon size={25} />
                                <h1>
                                    {ele?.heading}
                                </h1>
                            </div>
                            <p>{ele?.description}</p>
                            <p>{ele?.details}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Contactdetails;