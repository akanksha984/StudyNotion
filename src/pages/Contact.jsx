import Contactdetails from "../components/Contact page/ContactDetails";
import ContactFormSection from "../components/Contact page/ContactFormSection";
import ReviewSlider from "../components/common/ReviewSlider";

const Contact= ()=>{
    return(
        <div className="mx-auto mt-20 w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-5 lg:flex-row">
            {/* contact details */}
            <Contactdetails />

            {/* contact form */}
            <div className="lg:w-[60%]">
                <ContactFormSection />
            </div>
            

            {/* reviews from other learners */}
            <div>
                <h1 className="text-4xl text-center font-semibold mt-8">
                    Reviews from other Learners
                </h1>
                <ReviewSlider/>    
            </div>
            

            footer
        </div>
    )
}

export default Contact;