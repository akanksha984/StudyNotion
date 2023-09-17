import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../../common/IconBtn'
import {updateProfile} from '../../.././../services/operations/settingsApi'

const genders= ["Male","Female","Prefer not to say","Other"]
const EditProfile = () => {
  const {user}= useSelector((state)=>state.profile)
  const {token}= useSelector((state)=>state.auth)
  const navigate= useNavigate();
  const dispatch= useDispatch();
  const {register,handleSubmit,formState:{errors}}= useForm();
  
  const submitProfileForm= async(data)=>{
    try{
      console.log("got data: ",data);
      dispatch(updateProfile(token,data));
      navigate('/dashboard/my-profile')
    }catch(error){
      console.log("Error in updating the profile");
      console.log(error);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitProfileForm)}>
        {/* Profile Information */}
        <div className='my-10 flex flex-col gap-y-6 border-[1px] rounded-md border-richblack-700 bg-richblack-800 p-8 px-12'>
          <h2 className='text-lg font-semibold text-richblack-5'>
            Profile Information
          </h2>
          {/* first name and last name */}
          <div className='flex flex-col gap-5 lg:flex-row'>
            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='firstName' className='label-style'>
                First Name
              </label>
              <input type="text" name='firstName' id='firstName'
              placeholder='Enter your first name' className='input-style'
              {...register("firstName",{required:true})}
               defaultValue={user.firstName}/>
               {
                errors.firstName && (
                  <span className='error-style'>
                      Please enter your first name
                  </span>
                )
               }
            </div>

            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='lastName' className='label-style'>
                Last Name
              </label>
              <input type="text" name='lastName' id='lastName'
              placeholder='Enter your first name' className='input-style'
              {...register("lastName",{required:true})}
               defaultValue={user.lastName}/>
               {
                errors.lastName && (
                  <span className='error-style'>
                      Please enter your last name
                  </span>
                )
               }
            </div>
          </div>

          {/* dob and gender */}
          <div className='flex flex-col gap-5 lg:flex-row'>
            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='dateOfBirth' className='label-style'>
                Date Of Birth
              </label>
              <input type="date" name='dateOfBirth' id='dateOfBirth'
              placeholder='Enter your first name' className='input-style'
              {...register("dateOfBirth",{
                required:{
                  value:true, 
                  message:"Please enter your date of birth"
                },max:{
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of the birth cannot be more than current time"
                }
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}/>
              {
                errors.dateOfBirth && (
                  <span className='error-style'>
                      Please enter your date of birth
                  </span>
                )
              }
            </div>  
            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='gender' className='label-style'>
                Gender
              </label>
              <select type="text" name='gender' id='gender'
              placeholder='Enter your first name' className='input-style'
              {...register("gender",{required:{value:true,}})}
              defaultValue={user?.additionalDetails?.gender}>
                {
                  genders.map((ele,i)=>{
                    return (
                      <option key={i} value={ele}>
                        {ele}
                      </option>
                    )
                  })
                }
              </select>
              {
                errors.gender && (
                  <span className='error-style'>
                      Please enter your gender
                  </span>
                )
              }
            </div>  
          </div>

          {/* contact number and about */}
          <div className='flex flex-col gap-5 lg:flex-row'>
            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='contactNumber' className='label-style'>
                Contact Number
              </label>
              <input type="tel" name='contactNumber' id='contactNumber'
              placeholder='Enter your first name' className='input-style'
              {...register("contactNumber",{
                required:{value:true,},
                maxLength:{
                  value: 12,
                  message:"Invalid Contact Number"
                },
                minLength:{value:10, message:"Invalid Phone number"}
              })}
              defaultValue={user?.additionalDetails?.contactNumber} />
              {
                errors.contactNumber && (
                  <span className='error-style'>
                      Please enter your contact number {errors.contactNumber.message}
                  </span>
                )
              }
            </div> 
            <div className='flex flex-col gap-2 lg:w-[48%]'>
              <label htmlFor='about' className='label-style'>
                About
              </label>
              <input type="text" name='about' id='about'
              placeholder='Enter about yourself' className='input-style'
              {...register("about",{
                required:{value:true,}
              })}
              defaultValue={user?.additionalDetails?.about} />
              {
                errors.about && (
                  <span className='error-style'>
                      Please enter your contact number {errors.about.message}
                  </span>
                )
              }
            </div> 

          </div>
            
        </div>
        
        <div className='flex justify-end gap-2'>
          <button className='black-button'
          onClick={()=>navigate('/dashboard/my-profile')}>
            Cancel
          </button>
          <IconBtn type='submit' text='Save' />
        </div>
      </form>
    </>
  )
}

export default EditProfile