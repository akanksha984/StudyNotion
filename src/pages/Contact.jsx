import Contactdetails from "../components/Contact page/ContactDetails";
import ContactFormSection from "../components/Contact page/ContactFormSection";
import ReviewSlider from "../components/common/ReviewSlider";
import Footer from '../components/common/Footer'

const Contact= ()=>{
    return(
        <>
            <div className="mx-auto mt-20 w-11/12 max-w-maxContent flex flex-col justify-between gap-10 text-richblack-5 lg:flex-row">
                {/* contact details */}
                <div className="lg:w-[40%]">
                    <Contactdetails />
                </div>

                {/* contact form */}
                <div className="lg:w-[60%]">
                    <ContactFormSection />
                </div>
            </div>    

            {/* reviews from other learners */}
            <div className="relative mx-auto my-20 flex flex-col w-11/12 max-w-maxContent justify-between gap-8 bg-richblack-900 text-white">
                <h1 className="text-4xl text-center font-semibold mt-8 text-richblack-5">
                    Reviews from other Learners
                </h1>
                <ReviewSlider/>    
            </div>
            
            <Footer/>
        </>
    )
}

export default Contact;