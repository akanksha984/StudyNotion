import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {AiOutlineEye,AiOutlineEyeInvisible} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import IconBtn from "../../../common/IconBtn";
import { changePassword } from '../../../../services/operations/settingsApi';
import { useSelector } from 'react-redux';

const UpdatePassword = () => {
  const navigate= useNavigate();
  const {token}= useSelector((state)=> state.auth)
  const {register,handleSubmit,formState:{errors},}= useForm();
  const [showOldPassword,setShowOldPassword]= useState(false);
  const [showNewPassword,setShowNewPassword]= useState(false);
  const submitPasswordForm= async(data)=>{
    console.log("submit form data: ",data);
    try{
      await changePassword(token,data)
    }catch(error){
      console.log("Error : ", error);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(submitPasswordForm)}>
        <div className='my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
            <h2 className='text-lg font-semibold text-richblack-5 uppercase tracking-wider'>Password</h2>
            <div className='flex flex-col gap-5 lg:flex-row'>
              <div className='relative flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='oldPassword' className='label-style'>
                  Current Password
                </label>
                <input 
                type={showOldPassword?"text":"password"}
                id= 'oldPassword' name='oldPassword'
                placeholder='Enter your current password'
                className='input-style'
                {...register("oldPassword",{required:true})}
                />
                <span className='absolute right-3 top-[38px] z-[10] cursor-pointer'
                onClick={()=>setShowOldPassword((prev)=>!prev)} >
                  {
                    showOldPassword?
                    (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />)
                    :(<AiOutlineEye fontSize={24} fill='#AFB2BF' />
                    )
                  }
                </span>
                {
                  errors.oldPassword && (
                    <span className='error-style'>
                      Please enter your current password
                    </span>
                  )
                }
              </div>
              <div className='relative flex flex-col gap-2 lg:w-[48%]'>
                <label htmlFor='newPassword' className='label-style'>
                  New Password
                </label>
                <input 
                type={showNewPassword?"text":"password"}
                id= 'newPassword' name='newPassword'
                placeholder='Enter your new password'
                className='input-style'
                {...register("newPassword",{required:true})}
                />
                <span className='absolute right-3 top-[38px] z-[10] cursor-pointer'
                onClick={()=>setShowNewPassword((prev)=>!prev)} >
                  {
                    showNewPassword?
                    (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />)
                    :(<AiOutlineEye fontSize={24} fill='#AFB2BF' />
                    )
                  }
                </span>
                {
                  errors.newPassword && (
                    <span className='error-style'>
                      Please enter your current password
                    </span>
                  )
                }
              </div>
            </div>
        </div>
        <div className='flex justify-end gap-2'>
          <button  className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'
          onClick={()=>{navigate("/dashboard/my-profile")}}>
            Cancel
          </button>
          <IconBtn type='submit' text="Update" />
        </div>
      </form>
    </div>
  )
}

export default UpdatePassword