import ContactUsForm from "../../Contact page/ContactUsForm";

const ContactFormSection=()=>{
    return (
        <div className="mx-auto">
            <h1 className="text-center text-4xl font-semibold"> Get in Touch</h1>
            <p className="text-center font-semibold text-richblack-300 tracking-wider">
                We would love to hear from you ...
            </p>
            <div className="mt-12 mx-auto">
                <ContactUsForm/>
            </div>
        </div>
    )
}

export default ContactFormSection;