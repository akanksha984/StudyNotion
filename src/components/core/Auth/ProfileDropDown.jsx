import { useDispatch } from "react-redux";
import { logout } from "../../../services/operations/authAPI";
import { Link, useNavigate } from "react-router-dom";

const ProfileDropDown= ()=>{
    const dispatch= useDispatch();
    const navigate= useNavigate();
    return (
        <div className="text-white space-x-5">
            <button onClick={()=>dispatch(logout(navigate))}>
                Logout
            </button>
            <Link to="/dashboard/my-profile" >
                Dashboard
            </Link>
        </div>
    )
}

export default ProfileDropDown;