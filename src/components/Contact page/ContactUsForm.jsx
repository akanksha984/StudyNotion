import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/apis";
import CountryCode from "../../data/countrycode.json"

const ContactUsForm= ()=>{
    const [loading,setLoading]= useState(false);
    const {
        register, 
        handleSubmit,
        reset,
        formState: {errors,isSubmitSuccessful}
    }= useForm();
    useEffect(()=>{
        if (isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:""
            })
        }
    },[reset,isSubmitSuccessful]);

    const submitHandlerForContactForm=async(data)=>{
        console.log("got data", data);
        setLoading(true);
        try{
            //const response= await apiConnector("POST",contactusEndpoint.CONTACT_US_APICONTACTUS_API,data);

            console.log("got response->",data);
            //console.log("got response->",response);

        }catch(error){
            console.log("error in submitting the contact us form",error.message)
        }
        setLoading(false);
    }
    return (
        <form
        className="flex flex-col gap-7 mb-2"
        onSubmit={handleSubmit(submitHandlerForContactForm)}>
            {/* firstname and lastname */}
            <div className="flex flex-col gap-5 lg:flex-row justify-between">
                <div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="firstname" className="label-style">First Name <sup className="text-pink-200">*</sup></label>
                    <input type="text" name="firstname" id="firstname" placeholder="Enter your first name"
                    className="input-style"
                    {...register("firstname",{required:true})}
                    />
                    {
                        errors.firstname && (
                            <span className="error-style">
                                Please enter your first name
                            </span>
                        )
                    }    
                </div>  
                <div div className="flex flex-col gap-2 lg:w-[48%]">
                    <label htmlFor="lastname" className="label-style">Last Name</label>
                    <input type="text" name="lastname" id="lastname" placeholder="Enter your last name"
                    className="input-style"
                    {...register("lastname")}
                    />
                </div>  
                
            </div>

            {/* email */}
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="label-style">Email Address <sup className="text-pink-200">*</sup></label>
                <input type="email" className="input-style" name="email" id="email" placeholder="Enter your email address"
                {...register("email",{required:true})}
                ></input>
                {
                    errors.email && (
                        <span className="error-style">
                            Please enter the email address
                        </span>
                    )
                }
            </div>

            {/* phone number */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phonenumber" className="label-style">Phone Number</label>
                <div className="flex justify-between align-center">
                    <div className="flex w-[81px] flex-col gap-2">
                        <select
                        name="dropdown"
                        id="dropdown"
                        {...register("countrycode",{required:true})}
                        className="input-style"
                        >
                        {
                            CountryCode.map((element,index)=>{
                                return(
                                    <option key={index}>
                                        {element.code}-{element.country}
                                    </option>)
                                
                            })
                        }
                        </select>
                    </div>
                    {/* phone number field */}
                    <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                        <input
                        type="number" name="phonenumber" id="phonenumber" placeholder="12345-67890"
                        className="input-style"
                        {...register("phonenumber",{
                            required: {value:true, message:"Please enter yor phone number"},
                            maxLength: {value:10,message:"Invalid phone number"},
                            minLength: {value:8,message:"Invalid phone number"}
                        })}
                        ></input>
                    </div>
                    {
                        errors.phoneNo && (
                            <span className="error-style">
                                Please enter valid phone number
                                {errors.phoneNo.message}
                            </span>
                        )
                    }                    
                </div>
                {/* dropdown */}


            </div>

            {/* message */}
            <div className="flex flex-col gap-2">
                <label htmlFor="message" className="label-style">Message <sup className="text-pink-200">*</sup></label>
                <textarea
                name="message" id= "message" cols="30" rows={7} placeholder="Enter your message..."
                {...register("message",{required:true})}
                className="input-style"
                />
                {
                    errors.message && (
                        <span className="error-style"> 
                            Please enter your message
                        </span>
                    )
                }
            </div>

            <button type="submit"
            className={`w-fit mx-auto rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px] rgba(255,255,2555,0.18)
            ${!loading && "transition-all duration-200 hover:scale-95 hover:shadow-none"} disabled:bg-richblack-500 sm:text-[16px]`}
            >
                Submit
            </button>
        </form>
    )
}

export default ContactUsForm;