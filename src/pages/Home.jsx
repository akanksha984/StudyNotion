import {FaArrowRight} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import Footer from "../components/common/Footer";
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';

const Home= ()=>{
    return (
        <div>
            {/* section 1 */}
            <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center justify-between text-white">
                <Link to={"/signup"}>
                    <div className='mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-rich-200 transition-all duration-200 hover:scale-95 w-fit group'>
                        <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                            <p>Become an instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div>
                </Link>
                <div className='text-4xl font-semibold text-center mt-7'>
                    Empower Your Future with <HighlightText text={"Coding Skills"} />
                </div>
                <div className='w-[90%] text-center text-lg font-bold text-richblack-300 mt-4 '>
                    With our unique coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on-projects, quizzes, andpersonalized feedback from instructors
                </div>
                <div className='flex flex-row gap-7 mt-8'>
                    {/* call to action button*/}
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>
                <div className='mx-3 my-12 shadow-blue-200'>
                    <video muted loop autoPlay>
                    <source src={Banner} type="video/mp4"></source>
                    </video>
                </div>

                {/*code section 1 */}
                <div>
                    <CodeBlocks
                    position={"lg:flex-row"}
                    heading= {
                        <div className='text-4xl font-semibold'>
                            Unlock your <HighlightText text={"coding potential"}></HighlightText> with our online courses
                        </div>
                    }
                    subheading={
                        <div>
                            Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.
                        </div>
                    }
                    ctabtn1={
                        {
                            btnText:"Try it yourself",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeblock={`this is demo\n running text \n lets see if it works fine \n or will it crash`}
                    codeColor= {"text-yellow-25"}
                    ></CodeBlocks>
                </div>
                {/*code section 2 */}
                <div>
                    <CodeBlocks
                    position={"lg:flex-row-reverse"}
                    heading= {
                        <div className='text-4xl font-semibold'>
                            Unlock your <HighlightText text={"coding potential"}></HighlightText> with our online courses
                        </div>
                    }
                    subheading={
                        <div>
                            Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.
                        </div>
                    }
                    ctabtn1={
                        {
                            btnText:"Try it yourself",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText:"Learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeblock={`this is demo\n running text \n lets see if it works fine \n or will it crash`}
                    codeColor= {"text-red-400"}
                    ></CodeBlocks>
                </div>

                <ExploreMore/>
            </div>
            {/* section 2 */}
            <div className='bg-pure-greys-5 text-richblack-700'>
                <div className='homepage_bg h-[310px]'>
                    <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto'>
                        <div className='h-[150px]'></div>
                        <div className='flex gap-7 text-white'>
                            <CTAButton
                            linkto={"/signup"}
                            active={true}
                            >
                                <div className='flex gap-3 items-center'>
                                    Explore full catalog
                                    <FaArrowRight/>
                                </div>
                            </CTAButton>
                            <CTAButton linkto={"/login"} active={false}>
                                Learn more
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className='w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-between gap-7'>
                    <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                        <div className='text-4xl font-semibold w-[45%'>
                            Get the Skills you need for a 
                            <HighlightText text="Job in demand"/>
                        </div>
                        <div className='flex flex-col gap-10 w-[40%] items-start'>
                            <div className='text-[16px'>
                                The modern Studynotion dictates its own terms. Today, to be a competitive specialist requires more than professional skills
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                        </div>
                    </div>
                <TimelineSection/>

                <LearningLanguageSection/>
                </div>

            </div>
            {/* section 3 */}
            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 mt-8 bg-richblack-900 text-white'>
                <InstructorSection/>
                <h2 className='text-center text-4xl font-semibold mt-10'>Review from Other Learners</h2>
                <ReviewSlider/>

            </div>
            {/* footer */}
            <Footer/>
        </div>
    )
}
export default Home;