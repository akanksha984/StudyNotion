import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {sendOtp} from "../../../services/operations/authAPI";
import { setSignUpData } from "../../../slices/authSlice";

const SignupForm= ()=>{
    const [formData,setFormData]= useState({
        firstName:"", lastName:"",
        email:"", password:"",
        confirmPassword:""
    });
    const [showPassword,setShowPassword]= useState(false);
    const [showPassword1,setShowPassword1]= useState(false);
    const [accountType,setAccountType]= useState('Student');
    const dispatch= useDispatch();
    function changeHandler(event){
        setFormData((prev)=>({
            ...prev,
            [event.target.name]: event.target.value
        }));
    }
    const navigate= useNavigate();
    function submitHandler(event){
        event.preventDefault();
        if (formData.password !== formData.confirmPassword){
            toast.error("Password do not match");
            return;
        }
        /* toast.success("Account created successfully");
        console.log(formData);
        navigate("/dashboard"); */
        const signupData= {...formData,accountType};
        console.log("form data->",formData);
        console.log("signupdata->",signupData);
        dispatch(setSignUpData(signupData));
        dispatch(sendOtp(formData.email,navigate));

        //reset
        setFormData({firstName:"",lastName:"",email:"",password:"",confirmPassword:""});
        //setAccountType(accountType.student);
        setAccountType("Student");
    }
    return (
        <div>
            <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
                <button
                onClick={()=>setAccountType("Student")}
                className={`${accountType==="Student"
                ?"bg-richblack-900 text-richblack-5"
                :"bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}>
                    Student
                </button>
                <button
                onClick={()=>setAccountType("Instructor")}
                className={`${accountType==="Instructor"
                ?"bg-richblack-900 text-richblack-5"
                :"bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}>
                    Instructor
                </button>
            </div>

            <form onSubmit={submitHandler} className="flex flex-col gap-y-[20px]">
                <div className="flex gap-x-4">
                    <label>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">FirstName<sup className="text-pink-200">*</sup></p>
                        <input required type="text" name="firstName" onChange={changeHandler} placeholder="Enter your first name" value={formData.firstName}
                        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-2 border-b-richblack-600"></input>
                    </label>
                    <label>
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Lastname <sup className="text-pink-200">*</sup></p>
                        <input required type="text" name="lastName" onChange={changeHandler} placeholder="Enter your last name" value={formData.lastName}
                        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-2 border-b-richblack-600"></input>
                    </label>    
                </div>
                
                <label>
                    <p  className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Email<sup className="text-pink-200">*</sup></p>
                    <input required type="email" name="email" value={formData.email} onChange={changeHandler} placeholder="Enter email address"
                    className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-2 border-b-richblack-600"></input>
                </label>
                <div className="flex gap-x-4">
                    <label className="relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Password<sup className="text-pink-200">*</sup></p>
                        <input required type={showPassword? ("text"):("password")} name="password" value={formData.password} onChange={changeHandler} placeholder="Enter password"
                        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-2 border-b-richblack-600"></input>
                        <span onClick={()=> setShowPassword((prev)=>!prev)}
                        className="absolute text-white top-[38px] right-3 cursor-pointer">
                        {showPassword? 
                            <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>
                            :<AiOutlineEye fontSize={24} fill='#AFB2BF'/>}
                        </span>
                    </label>
                    <label className="relative">
                        <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">Confirm Password<sup className="text-pink-200">*</sup></p>
                        <input required type={showPassword1? ("text"):("password")} name="confirmPassword" value={formData.confirmPassword} onChange={changeHandler} placeholder="Confirm password"
                        className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-2 border-b-richblack-600"></input>
                        <span onClick={()=> setShowPassword1((prev)=>!prev)}
                        className="absolute text-white top-[38px] right-3 cursor-pointer">
                            {showPassword1? 
                            <AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF'/>
                            :<AiOutlineEye fontSize={24} fill='#AFB2BF'/>}
                        </span>
                    </label>
                </div>
                <button className="w-full bg-yellow-50 rounded-[8px] font-medium text-richblack-900 px-[12px] py-[8px] mt-6">
                    Create Account
                </button>
            </form>
        </div>
    )
}
export default SignupForm;