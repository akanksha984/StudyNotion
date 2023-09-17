import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiconnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/categoryPageAPI";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import CourseCard from "../components/core/Catalog/CourseCard";
import Error from "../pages/Error";
import Footer from "../components/common/Footer"

const Catalog= ()=>{
    const {catalogName}= useParams();
    const [catalogPageData,setCatalogPageData]= useState();
    const [categoryId,setCategoryId]= useState();   // user can cahnge tag anytim
    const [loading,setLoading]= useState(false);
    const [active,setActive]= useState(1);

    useEffect(()=>{
        const getCategory= async()=>{
            setLoading(true);
            const res= await apiConnector("GET",categories.CATEGORIES_API);
            //console.log("res",res.data.data);
            const category_id= res?.data?.data?.filter((ct)=>ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
            setLoading(false);
        }
        getCategory();
    },[catalogName]);

    useEffect(()=>{
        const getCategoryDetails= async()=>{
            try{
                setLoading(true);
                //console.log("id category->",categoryId);
                const res= await getCatalogPageData(categoryId);
                //console.log(res);
                setCatalogPageData(res);
                setLoading(false);
            }catch(error){
                console.log("Error ->",error.message);
            }
        }
        if (categoryId){
            getCategoryDetails();
        }
    },[categoryId]);

    if (loading || !catalogPageData){
        return (
            <div>
                Loading...
            </div>
        )
    }
    if (!loading && !catalogPageData.success){
        return <Error/>
    }
    return (
        <div className="box-content bg-richblack-800 px-8">
            <div className="flex mx-auto min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
                <p className="text-sm text-richblack-300">{`Home / Catalog / `}
                    <span className="text-yellow-25">{catalogPageData?.data?.selectedCategory?.name}</span>
                </p>
                <p className="text-richblack-5 text-3xl">{catalogPageData?.data?.selectedCategory?.name}</p>
                <p className="text-richblack-200 max-w-[870px] italic">{catalogPageData?.data?.selectedCategory?.description}</p>
            </div>
            <div className="bg-richblack-900 pt-5">
             
            {/* section1 */}
            <div className="mx-auto box-content w-full max-w-maxContentTab lg:max-w-maxContent">
                <div className='text-center text-4xl font-semibold text-richblack-5 mb-5'>Courses to get you started</div>
                <div className="flex my-4 border-b border-b-richblack-600 text-sm w-max">
                    <p className={`px-4 py-2 ${active===1?"border-b border-b-yellow-25 text-yellow-25":"text-richblack-50"} cursor-pointer`} onClick={()=>{setActive(1)}}>Most Popular</p>
                    <p className={`px-4 py-2 ${active===2?"border-b border-b-yellow-25 text-yellow-25":"text-richblack-50"} cursor-pointer`} onClick={()=>{setActive(2)}}>New </p>
                </div>
                <div>   
                    {/* {
                        console.log("paasing data", catalogPageData)
                    } */}
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.course} />
                </div>
                
            </div>

            {/* section 2 */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-10 lg:max-w-maxContent">
                <div className='text-center text-3xl font-semibold mt-16 text-richblack-5 mb-10'>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.course} />
                </div>
                
            </div>

            {/* section 3 */}
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-10 lg:max-w-maxContent">
                <p className='text-center text-3xl font-semibold mt-16 text-richblack-5 mb-10'>Frequently Brought </p>
                <div className="py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-32">
                        {
                            catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                            .map((course,index)=>(
                                <CourseCard course={course} key={index} Height={"h-[400px]"}></CourseCard>
                            ))
                        }

                    </div>

                </div>
            </div>
   
            </div>
            {/* footer */}
            <Footer/>
        </div>
    )
}

export default Catalog;
