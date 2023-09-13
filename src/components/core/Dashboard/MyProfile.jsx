import { useSelector } from "react-redux";
import IconBtn from "../../common/IconBtn";
import { useNavigate } from "react-router-dom";
import { IconBase } from "react-icons";
import {RiEditBoxLine} from "react-icons/ri"

const MyProfile= ()=>{
    const {user}= useSelector((state)=>state.profile);
    //console.log("my-profile:->",user);
    const navigate= useNavigate();
    return (
        <div className="text-[#5b55ff]">
            <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                My Profile
            </h1>

            {/* section 1 */}
            <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex items-center gap-x-4">
                    <img src={`${user?.image}`} alt={`profile- ${user?.firstName}`}
                    className="aspect-square w-[78px] rounded-full object-cover" />
                    <div className="space-y-1">
                        <p className="text-lg font-semibold text-richblack-5">
                            {user?.firstName + " " + user?.lastName}
                        </p>
                        <p className="text-md text-richblack-300 tracking-wider">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <IconBtn
                    text="Edit"
                    onClick={()=>navigate("/dashboard/settings")}
                >
                    <RiEditBoxLine />
                </IconBtn>
            </div>

            {/* section 2 */}
            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex w-full justify-between items-center ">
                    <p className="text-lg font-semibold text-richblack-5">About</p>
                    <IconBtn text="Edit" onClick={()=>navigate("/dashboard/settings")} >
                        <RiEditBoxLine />
                    </IconBtn>
                </div>
                <div className={`${user?.additionalDetails?.about
                ?"text-richblack-5":"text-richblack-400 italic"}`}>
                        {user?.additionalDetails?.about ?? "Write something about yourself..."}
                </div>
            </div>

            {/* section 3 */}
            <div  className="flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex justify-between items-center w-full">
                    <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
                    <IconBtn
                    text="Edit"
                    onClick={()=>navigate("/dashboard/settings")}
                    >
                        <RiEditBoxLine />
                    </IconBtn>
                </div>
                <div className="flex max-w-[500px] justify-between">
                    <div className="flex flex-col gap-y-5">
                        <div>
                            <p className="mb-2 text-sm text-richblack-500">FirstName</p>
                            <p className="text-sm font-medium text-richblack-5">{user?.firstName}</p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-500">Email</p>
                            <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-500">Gender</p>
                            <p className={`text-sm font-medium  ${user?.additionalDetails?.gender ? "text-richblack-5":"text-richblack-300 italic"}`}>{user?.additionalDetails?.gender ?? "Add your gender"}</p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-500">Last Name</p>
                            <p className="text-sm font-medium text-richblack-5">{user?.lastName}</p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-500">Phone Number</p>
                            <p className={`text-sm font-medium  ${user?.additionalDetails?.contactNumber ? "text-richblack-5":"text-richblack-300 italic"}`}>{user?.additionalDetails?.contactNumber ?? "Add your Phone number"}</p>
                        </div>
                        <div>
                            <p className="mb-2 text-sm text-richblack-500">Date Of Birth</p>
                            <p className={`text-sm font-medium  ${user?.additionalDetails?.dateOfBirth ? "text-richblack-5":"text-richblack-300 italic"}`}>{user?.additionalDetails?.dateOfBirth ?? "Add your date of birth"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;