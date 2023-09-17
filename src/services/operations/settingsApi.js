import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector";
import { logout } from "./authAPI";
import {settingsEndpoints} from '../apis'
import { setUser } from "../../slices/profileSlice";

const {DELETE_PROFILE_API, UPDATE_DISPLAY_PICTURE_API, CHANGE_PASSWORD_API, UPDATE_PROFILE_API}= settingsEndpoints;

export function updateDisplayPicture(token,formData){
    return async(dispatch)=>{
        const toastId= toast.loading("Loading...")
        try{
            const response= await apiConnector("PUT",UPDATE_DISPLAY_PICTURE_API,formData,{
                "Content-type": "multipart/form-data",
                "Authorisation": `Bearer ${token}`,
            })
            console.log("Update profile pic api response: ", response);
            if (!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Profile Picture updated successfully")
            dispatch(setUser(response.data.data));
        }catch(error){
            console.log("Error in update display profile api: ",error);
            toast.error("Could not update the profile picture")
        }
        toast.dismiss(toastId)
    }
}

export function updateProfile(token,formData){
    return async(dispatch)=>{
        const toastId= toast.loading("Loading...")
        try{
            const response= await apiConnector("PUT",UPDATE_PROFILE_API,formData,{
                "Authorisation": `Bearer ${token}`,
            })
            console.log("update profile api response")
            if (!response.data.success){
                throw new Error(response.data.message)
            }
            const userImage= response.data.updatedUserDetails.image?
            response.data.updatedUserDetails.image 
            : `https://api.dicebear.com/5.x/inititals/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            dispatch(setUser({...response.data.updatedUserDetails, image: userImage}))
            toast.success("Updated the profile successfully")
        }catch(error){
            console.log("Error in update Profile api: ",error);
            toast.error("Could not update profile")
        }
        toast.dismiss(toastId)
    }
}

export async function changePassword(token,formData){
    const toastId= toast.loading("Loading...")
    try{
        const response= await apiConnector("POST",CHANGE_PASSWORD_API,formData,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("Change password api response: ",response);
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Password Changed Successfully")
    }catch(error){
        console.log("change password api error: ", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export function deleteProfile(token,navigate){
    return async(dispatch)=>{
        const toastId= toast.loading("Loading...");  
        let result= [];
        try{
            const response= await apiConnector("DELETE",DELETE_PROFILE_API, null,{
                "Authorisation": `Bearer ${token}`,
            })
            console.log("delete profile api response...",response);
            if (!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("YOur account has been deleted")
            dispatch(logout(navigate))
        }catch(error){
            console.log("Error in delete account : ", error);
        }
        toast.dismiss(toastId);
        return result;
    }
}


