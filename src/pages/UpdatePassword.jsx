import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";

const UpdatePassword= ()=>{
    const {loading}= useSelector((state)=>state.auth);
    const [showPassword,setShowPassword]= useState(false);
    const [showConfirmPassword,setShowConfirmPassword]= useState(false);
    const dispatch= useDispatch();
    const location= useLocation();
    const [formData,setFormData]= useState({
        password:"",
        confirmPassword:""
    });
    const changeHandler= (e)=>{
        setFormData((prevData)=>({
            ...prevData,
        [e.target.name]: e.target.value,
        }))
    }
    function submitHandler(e){
        e.preventDefault();
        const token= location.pathname.split('/').at[-1];
        dispatch(resetPassword(formData.password,formData.confirmPassword,token));
    }
    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            {
                loading?
                (<div>
                    Loading... 
                </div>)
                :(
                    <div className="max-w-[500px] p-4 lg:p-8">
                        <h1 className="text-richblack-5 text-[1.875rem] font-semibold leading-[2.375rem]">Set new password</h1>
                        <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-5">Almost done. Enter your new password and you are all set.</p>
                        <form onSubmit={submitHandler} className="flex flex-col gap-y-5">
                            <label className="relative">
                                <p className="mb-1 text-[0.975rem] leading-[1.375rem] text-richblack-5">New Password <sup className="text-pink-200">*</sup></p>
                                <input
                                required
                                type={showPassword?"text":"password"}
                                name="password"
                                value={formData.password}
                                onChange= {changeHandler}
                                placeholder="Enter the new password"
                                className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-2 border-b-richblack-600"
                                ></input>
                                <span onClick={()=>setShowPassword((prev)=>(!prev))}
                                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                                >
                                    {
                                        showPassword?
                                        (<AiFillEyeInvisible fontSize={24} fill="#AFB2BF"/>)
                                        :(<AiFillEye fontSize={24} fill="#AFB2BF"/>)
                                    }
                                </span>
                            </label>
                            <label className="relative">
                                <p className="mb-1 text-[0.975rem] leading-[1.375rem] text-richblack-5">Confirm Password <sup className="text-pink-200">*</sup></p>
                                <input
                                required
                                type={showConfirmPassword?"text":"password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange= {changeHandler}
                                placeholder="Confirm password"
                                className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-b-2 border-b-richblack-600"
                                ></input>
                                <span onClick={()=>setShowConfirmPassword((prev)=>(!prev))}
                                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                                >
                                    {
                                        showConfirmPassword?
                                        (<AiFillEyeInvisible fontSize={24} fill="#AFB2BF"/>)
                                        :(<AiFillEye fontSize={24} fill="#AFB2BF"/>)
                                    }
                                </span>
                            </label>
                            
                            <button>
                                Reset Password
                            </button>
                        </form>
                        <div>
                            <Link to="/login">
                                <p>Back to login</p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default UpdatePassword;