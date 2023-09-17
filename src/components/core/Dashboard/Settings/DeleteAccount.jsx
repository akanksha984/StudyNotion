import React from 'react'
import {FiTrash2} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteProfile } from '../../../../services/operations/settingsApi'

const DeleteAccount = () => {
    const {token}= useSelector((state)=>state.auth)
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const handleDelete= ()=>{
        try{
            dispatch(deleteProfile(token,navigate))
        }catch(error){
            console.log("Error in deleting the account.. ", error)
        }
    }
  return (
      <div className='my-10 flex flex-row gap-x-5 border-[1px] rounded-md border-pink-700 bg-pink-900 p-8 px-12'>
        <div className='flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700'>
            <FiTrash2 className='text-3xl text-pink-200' />
        </div>
        <div className='flex flex-col space-y-2'>
            <h2 className='text-lg font-semibold text-richblack-5'>
                Delete Account
            </h2>
            <div className='w-3/5 text-pink-25'>
                <p>Would you like to delete your account?</p>
                <p>
                    This account may contain paid courses. Deleting your account is permanent and will remove all the content associated with it.
                </p>
            </div>
            <button type='button' className='w-fit text-pink-300 cursor-pointer italic'
            onClick={handleDelete}>
                I want to delete my account
            </button>
        </div>
    </div>
  )
}

export default DeleteAccount