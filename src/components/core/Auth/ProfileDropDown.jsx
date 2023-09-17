import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../services/operations/authAPI";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import {VscDashboard, VscSignOut} from 'react-icons/vsc'
import useOnClickOutisde from "../../../hooks/useOnClickOutside"

const ProfileDropDown= ()=>{
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const {user}= useSelector((state)=>state.profile)
    const [open,setOpen]= useState(false)
    const ref= useRef(null);
    useOnClickOutisde(ref,()=>setOpen(false))
    if (!user)return null;
    return (
        /* <div className="text-white space-x-5">
            <button onClick={()=>dispatch(logout(navigate))}>
                Logout
            </button>
            <Link to="/dashboard/my-profile" >
                Dashboard
            </Link>
        </div> */

        <button className="relative" onClick={()=>setOpen(true)}>
            <div className="flex items-center gap-x-1">
                <img src={user?.image} alt={`profile-${user?.firstName}`}
                className="aspect-square w-[30px] rounded-full object-cover" />
                <AiOutlineCaretDown className="text-sm text-richblack-100" />
            </div>
            {
                open && (
                    <div onClick={(e)=>e.stopPropagation()}
                    className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden bg-richblack-800 border-richblack-700 border-[1px] rounded-md"
                    ref={ref}>
                        <Link to='/dashboard/my-profile' onClick={()=>setOpen(false)}>
                            <div className="text-richblack-100 flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm hover:bg-richblack-700 hover:text-richblack-25">
                                <VscDashboard className='text-lg' />
                                Dashboard
                            </div>
                        </Link>
                        <div 
                        onClick={()=>{
                            dispatch(logout(navigate))
                            setOpen(false)
                        }}
                        className="text-richblack-100 flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm hover:bg-richblack-700 hover:text-richblack-25">
                            <VscSignOut className="text-lg" />
                            Logout
                        </div>
                    </div>
                )
            }
        </button>
    )
}

export default ProfileDropDown;