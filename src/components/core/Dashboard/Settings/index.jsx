import React from 'react'
import ChangeProfilePic from './ChangeProfilePic'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteAccount'

const Settings = () => {
  return (
    <div className='text-richblack-5'>
      <h1 className='mb-14 text-3xl font-medium text-richblack-5'>
        Edit Profile
      </h1>
      <ChangeProfilePic/>
      <EditProfile/>
      <UpdatePassword/>
      <DeleteAccount/>
    </div>
  )
}

export default Settings