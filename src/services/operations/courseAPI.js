import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";
import { toast } from "react-hot-toast";

const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    DELETE_COURSE_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED_API,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API
}= courseEndpoints;

export const getAllCourses= async()=>{
    const toastId= toast.loading("Loading...");
    let result= [];
    try{
        const response= await apiConnector("GET",GET_ALL_COURSE_API);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        result= response?.data?.success;
    }catch(error){
        console.log("Error in fetching all the courses");
        console.log(error.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const fetchCourseDetails= async(courseId)=>{
    const toastId= toast.loading("Loading...");
    //console.log("course api mein:->" ,courseId);
    let result= null;
    try{
        const response= await apiConnector("POST",COURSE_DETAILS_API,{courseId});
        //console.log("got fetch course details response: ", response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        result= response?.data;
    }catch(error){
        console.log("Error in fetching course details");
        console.log(error.message);
    }
    toast.dismiss(toastId);
    return result;

}

export const fetchCourseCategories=async()=>{
    let res=[];
    try{
        const response= await apiConnector("GET",COURSE_CATEGORIES_API);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        res= response?.data?.data;
    }catch(error){
        console.log("course category api error",error);
        toast.error(error.message)
    }
    return res;
}

export const addCourseDetails= async(data,token)=>{
    let result= null;
    const toastID= toast.loading("Loading...");
    try{
        const response= await apiConnector("POST",CREATE_COURSE_API,data,{
            "Content-Type":"multipart/form-data",
            Authorisation: `Bearer ${token}`
        })
        console.log("add course details res", response);
        if (!response?.data?.success){
            throw new Error(response.data.message);
        }
        toast.success("Course Details Added Successfully");
        result= response.data.data;
    }catch(error){
        console.log("Error in creating course", error.message);
        toast.error("Failed to create course");
    }
    toast.dismiss(toastID);
    return result;
}

export const editCourseDetails= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("POST",EDIT_COURSE_API,data,{
            "Content-Type":"multipart/form-data",
            "Authorisation":`Bearer ${token}`,
        })
        console.log("edit course response", response);
        if (!response?.data?.success){
            throw new Error(response.data.message);
        }
        result= response.data.data;
    }catch(error){
        console.log("Error in updating the section",error.message);
        toast.error("error in updating the section");
    }
    toast.dismiss(toastId);
    return result;
}

export const createSection= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading..."); 
    try{
        const response= await apiConnector("POST",CREATE_SECTION_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("create section api response",response);
        if (!response.data.success){
            throw new Error(response.data);
        }
        toast.success("Section created successfully");
        result= response.data.updatedCourse;
    }catch(error){
        console.log("Error in creating section", error.message);
        toast.error("Error in creating section");
    }
    toast.dismiss(toastId);
    return result;
}

export const createSubSection= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("POST",CREATE_SUBSECTION_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("create subsection api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Lecture Added");
        result= response.data.data;
    }catch(error){
        console.log("Error in creating subsection", error.message);
        toast.error("Error in creating subsection");
    }
    toast.dismiss(toastId);
    return result;
}

export const updateSection= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("POST",UPDATE_SECTION_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("update section api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Updated section created successfully");
        result= response.data.data;
    }catch(error){
        console.log("Error in updating section", error.message);
        toast.error("Error in updating section");
    }
    toast.dismiss(toastId);
    return result;
}

export const updateSubSection= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("POST",UPDATE_SUBSECTION_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("update subsection api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Lecture Added");
        result= response.data.data;
    }catch(error){
        console.log("Error in updating subsection", error.message);
        toast.error("Error in updating subsection");
    }
    toast.dismiss(toastId);
    return result;
}

export const deleteSection= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("DELETE",DELETE_SECTION_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("delete section api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Deleted section created successfully");
        result= response.data.data;
    }catch(error){
        console.log("Error in deleting section", error.message);
        toast.error("Error in deleting section");
    }
    toast.dismiss(toastId);
    return result;
}

export const deleteSubSection= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("DELETE",DELETE_SUBSECTION_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("delete subsection api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Lecture Deleted");
        result= response.data.data;
    }catch(error){
        console.log("Error in deleting subsection", error.message);
        toast.error("Error in deleting subsection");
    }
    toast.dismiss(toastId);
    return result;
}

export const fetchInstructorCourses= async(token)=>{
    let result= [];
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("GET",GET_ALL_INSTRUCTOR_COURSES_API,null,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("instructor courses api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        result= response.data.data;
    }catch(error){
        console.log("Error in fetching instructor courses", error.message);
    }
    toast.dismiss(toastId);
    return result;
}

export const deleteCourse= async(data,token)=>{
    const toastId= toast.loading("Loading...");
    try{    
        console.log("course api passed:",data);
        const response= await apiConnector("DELETE",DELETE_COURSE_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("delete course api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Course Deleted");
    }catch(error){
        console.log("Error in deleting course", error.message);
        toast.error("Error in deleting course");
    }
    toast.dismiss(toastId);
}

export const getFullDetailsOfCourse= async(courseId,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        //console.log("course id in course api got-> ",courseId);
        const response= await apiConnector("POST",GET_FULL_COURSE_DETAILS_AUTHENTICATED_API,{courseId},{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("getfullcoursedetails api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        result= response.data.data;
    }catch(error){
        console.log("Error in fetching full details of course", error.message);
        toast.error("Error in fetching full details of course");
    }
    toast.dismiss(toastId);
    return result;
}

export const markLectureAsComplete= async(data,token)=>{
    let result= null;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("POST",LECTURE_COMPLETION_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("mark lec as complete api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Lecture Completed!");
        result= true;
    }catch(error){
        console.log("Error in markign lec as complete", error.message);
        toast.error("Error in markign lec as complete");
    }
    toast.dismiss(toastId);
    return result;
}

export const createRating= async(data,token)=>{
    let result= false;
    const toastId= toast.loading("Loading...");
    try{
        const response= await apiConnector("POST",CREATE_RATING_API,data,{
            "Authorisation": `Bearer ${token}`,
        })
        console.log("create rating api response",response);
        if (!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Rating Added!");
        result= true;
    }catch(error){
        console.log("Error in creating rating", error.message);
        toast.error("Error in creating rating");
    }
    toast.dismiss(toastId);
    return result;
}


