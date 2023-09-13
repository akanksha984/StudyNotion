import ContactUsForm from "./ContactUsForm"

const ContactFormSection= ()=>{
    return (
        <div className="border border-richblack-600 text-richblack-300 rounded-xl lg:p-14 flex flex-col gap-3">
            <h1 className="text-4xl leading-10 text-richblack-5 font-semibold">
                Got an Idea ? We have got the skills. Let's team up
            </h1>
            <p className="italic">
                Tell us more about yourself and what you got in your mind
            </p>
            <div className="mt-7">
                <ContactUsForm/> 
            </div>

        </div>
    )
}

export default ContactFormSection