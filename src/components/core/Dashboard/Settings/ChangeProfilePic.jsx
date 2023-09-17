import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IconBtn from '../../../common/IconBtn'
import {FiUpload} from 'react-icons/fi'
import { updateDisplayPicture } from '../../../../services/operations/settingsApi'
import { setLoading } from '../../../../slices/authSlice'

const ChangeProfilePic = () => {
  const {token}= useSelector((state)=>state.auth);
  const {user}= useSelector((state)=>state.profile)
  const dispatch= useDispatch();
  const [loading,setLoading]= useState(false);
  const [imageFile,setImageFile]= useState(null);
  const [previewSource,setPreviewSource]= useState(null);

  const fileInputRef= useRef(null);
  const handleFileChange= (e)=>{
    const file= e.target.files[0];
    if (file){
      setImageFile(file)
      previewFile(file)
    }
  }
  const previewFile= (file)=>{
    const reader= new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend= ()=>{
      setPreviewSource(reader.result)
    }
  }
  const handleClick= ()=>{
    fileInputRef.current.click();
  }
  const handleFileUpload= ()=>{
    try{
      console.log("Uplaoding...")
      setLoading(true);
      const formData= new FormData()
      formData.append("displayPicture",imageFile)
      dispatch(updateDisplayPicture(token,formData)).then(()=>{
        setLoading(false)
      })
    }catch(error){
      console.log("Error in updating the profile picture", error)
    }
  }
  useEffect(()=>{
    if (imageFile){
      previewFile(imageFile)
    }
  },[imageFile])
  return (
    <>
      <div className='flex items-center justify-between border-[1px] rounded-md border-richblack-700 bg-richblue-800 p-8 px-12 text-richblack-5'>
        <div className='flex items-center gap-x-4'>
          <img src={previewSource || user?.image}
          alt={`profile ${user?.firstName}`}
          className= 'aspect-square w-[78px] rounded-full object-cover'></img>
          <div className='space-y-2'>
            <p>Change Profile Picture</p>
            <div className='flex flex-row gap-3'>
              <input type='file' ref={fileInputRef}
              onChange={handleFileChange} className='hidden'
              accept='image/png, image/gif, image/jpeg, image/jpg' />
              <button onClick={handleClick} disabled={loading}
              className='black-button'>
                Select
              </button>
              <IconBtn text={loading?"Loading...":"Upload"} onClick={handleFileUpload}>
              {
                !loading && (
                  <FiUpload className='text-lg text-richblack-900' />
                )
              }
              </IconBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangeProfilePic