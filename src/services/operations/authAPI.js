import { toast } from "react-hot-toast";
import {setLoading, setToken} from "../../slices/authSlice";
import {setUser} from "../../slices/profileSlice";
import { authEndpoints } from "../apis";
import {apiConnector} from "../apiconnector";
import {resetCart} from "../../slices/cartSlice";

const {SENDOTP_API,LOGIN_API,SIGNUP_API,RESETPASSWORDTOKEN_API,RESETPASSWORD_API,base}= authEndpoints;
//const dispatch= useDispatch();

export function sendOtp(email,navigate){
    return async(dispatch)=>{
        const toastId= toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response= await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent: true,
            });
            console.log("SENDOTP API RES: ",response);
            if (!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Sent OTP successfully");
            navigate("/verify-email");
        }catch(error){
            toast.error("Could not send OTP");
            console.log("Could not send otp", error.message);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function signup(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate){
    return async(dispatch)=>{
        const toastId= toast.loading("loading...");
        dispatch(setLoading(true));
        try{
            const response= await apiConnector("POST",SIGNUP_API,{
                accountType, firstName, lastName,
                email, password, confirmPassword, otp
            });
            //console.log("signup api res-> ",response);
            if (!response.data.success){
                console.log(response.data.error);
                throw new Error(response.data.message);
            }
            toast.success("Account created successfully");
            navigate("/login");
        }catch(e){
            console.log("error in signup",e);
            toast.error("Signup failed");
            navigate("/signup");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function login(email,password,navigate){
    return async(dispatch)=>{
        console.log(base);
        console.log(LOGIN_API);
        console.log(process.env.REACT_APP_BASE_URL);
        const toastId= toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response= await apiConnector("POST",LOGIN_API,{
                email,password
            });
            console.log("sign in response",response);
            if (!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Logged in successfully");
            dispatch(setToken(response.data.token));
            const userImage= response.data?.user?.userImage
            ?response.data.user.userImage:`https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
            console.log("response on login->",response);
            //const userImage= response.data.image;
            dispatch(setUser({...response.data.user, image: userImage}));
            //console.log("user logged in->",user);
            localStorage.setItem("token",JSON.stringify(response.data.token));  // taki refresh karne ke token na gayab ho aur user logout ho jaye
            localStorage.setItem("user",JSON.stringify(response.data.user)); // taki refresh karne pe profiel data na gayab ho
            navigate("/dashboard/my-profile");     
        }catch(error){
            console.log("error in login", error);
            toast.error("Error in login");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/");
    }
}

export function getPasswordResetToken(email,setEmailSent){
    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response= await apiConnector("POST",RESETPASSWORDTOKEN_API,{email});
            console.log("Reset password token response:->",response);
            if (!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Reset Email sent");
            setEmailSent(true);

        }catch(error){
            console.log("Error in  reset password token",error);
            toast.error(error.message);

        }
        setLoading(false);
    }
}

export function resetPassword(password,confirmPassword,token){
    return async(dispatch)=>{
        setLoading(true);
        try{
            const response= await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token});
            console.log("RESEt password response", response);
            if (!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Password has been reset successfully");
        }catch(error){
            console.log("Reset password error", error);
            toast.error("Unable to reset the password");
        }
        setLoading(false);
    }
}