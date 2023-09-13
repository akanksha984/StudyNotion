import React from 'react'
import { HiOutlineVideoCamera } from 'react-icons/hi'

const CourseSubsectionAccordion = ({subsec}) => {
  return (
    <div className='flex justify-between py-2'>
        <div className='flex items-center gap-2'>
            <span>
                <HiOutlineVideoCamera/>
            </span>
            <p>{subsec.title}</p>
        </div>
    </div>
  )
}

export default CourseSubsectionAccordion