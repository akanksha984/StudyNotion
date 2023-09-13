import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Frame from "../../../assets/Images/frame.png";
import {FcGoogle} from "react-icons/fc"

const Template= ({title,desc1,desc2,image,formtype})=>{
    return (
        <div className="w-11/12 max-w-[1160px] flex justify-between mx-auto py-12 gap-x-12 gap-y-0">
            <div className="w-11/12 max-w-[450px]">
                <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
                    {title}</h1>
                <p className="text-[1.125rem] leading-[1.625rem] mt-4">
                    <span className="text-richblack-100">{desc1}</span>
                    <br></br>
                    <span className="text-blue-100 italic">{desc2}</span>                    
                </p>

                {formtype==='signup'?<SignupForm/>:<LoginForm/>}
                <div className="flex flex-row w-full items-center my-4 gap-x-2">
                    <div className="w-full h-[1px] bg-richblack-600"></div>
                    <p className="text-richblack-600 font-medium leading-[1.375rem]">OR</p>
                    <div className="w-full h-[1px] bg-richblack-600"></div>
                </div>
                <button className="w-full flex justify-center items-center rounded-[8px] font-medium text-richblack-100 border border-richblack-700 px-[12px] py-[8px] gap-x-2 mt-6">
                    <FcGoogle/>
                    <p>Sign up with Google</p>
                </button>
            </div>
            <div className="relative w-11/12 max-w-[450px]">
                <img src={Frame} alt="frame" loading="lazy" width={558} height={504}></img>
                <img src={image} alt="student" loading="lazy" width={558} height={504}
                className="absolute -top-4 right-4"></img>
            </div>
        </div>
    )
}

export default Template;