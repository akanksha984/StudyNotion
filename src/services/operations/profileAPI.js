import {toast} from "react-hot-toast"
import {apiConnector} from "../../services/apiconnector";
import {logout} from "./authAPI";
import { profileEndpoints } from "../apis";
import { setLoading, setUser } from "../../slices/profileSlice";

const {GET_USER_DETAILS_API,GET_USER_ENROLLED_COURSES_API, GET_INSTRUCTOR_DASHBOARD_DATA}= profileEndpoints

export function getUserDetails(token,navigate){
    return async(dispatch)=>{
        const toastId= toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response= await apiConnector("GET",GET_USER_DETAILS_API,null,{
                Authorisation: `Bearer ${token}`,
            })
            console.log("getuserdetails api response",response);
            if (!response.data.success){
                throw new Error(response.data.message);
            }
            const userImage= response.data.data.image?response.data.data.image:`https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
            dispatch(setUser({...response.data.data, image:userImage}))
        }catch(error){
            dispatch(logout(navigate));
            console.log("error in getting getuserdetailsapi error..",error);
            toast.error("Could not get details")
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false))
    }
}

export async function getUserEnrolledCourses(token){
    const toastId= toast.loading("Loading...");
    let result= [];
    try{
        const response= await apiConnector("GET",GET_USER_ENROLLED_COURSES_API,null,
        {Authorisation:`Bearer ${token}`});
        console.log("response of get enrolled courses api",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        result= response.data.data
    }catch(error){
        console.log("ERror in getting enrolled courses",error);
        toast.error("Could not get enrolled course details")
    }
    toast.dismiss(toastId);
    return result;
}

export async function getInstructorData(token){
    const toastId= toast.loading("Loading...");
    let result= [];
    try{
        const response= await apiConnector("GET",GET_INSTRUCTOR_DASHBOARD_DATA,null,{
            "Authorisation": `Bearer ${token}`
        })
        //console.log("get instructor dashboard response", response);
        result= response.data.courses;
        if (!response.data.success){
            throw new Error(response.message);
        }
        
    }catch(error){
        console.log("Error in get instructor data api", error);
        toast.error("Could not get Instructor Dashboard data");
    }
    toast.dismiss(toastId);
    //console.log("sent result as -> ",result);
    return result;
}