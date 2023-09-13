import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";

export const getCatalogPageData= async(categoryId)=>{
    let result= [];
    const toastId= toast.loading("Loading...");
    try{
        const res= await apiConnector("POST",catalogData.CATALOG_PAGE_DATA_API,
        {categoryId:categoryId});
        if (!res.data.success){
            throw new Error(res.data.message);
        }
        result= res.data;

    }catch(error){
        console.log("error in getting category page data", error.message);
        toast.error("Error in fetching data");
    }
    toast.dismiss(toastId);
    return result;
}