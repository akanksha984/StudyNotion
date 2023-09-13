import copy from "copy-to-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
//import { addToCart } from "../../../slices/cartSlice";
import {BsFillCaretRightFill} from "react-icons/bs";
import {FaShareSquare} from "react-icons/fa";
const CourseDetailsCard= ({course,setConfirmationModal,handleBuyCourse,handleAddToCart})=>{
    const {thumbnail,price}= course;
    const {user}= useSelector((state)=>state.profile);
    const {token}= useSelector((state)=>state.auth);
    const navigate= useNavigate();
    const dispatch= useDispatch();
    
    /* function handleAddToCart(){
        if (user && user?.accountType==="INSTRUCTOR"){
            toast.error("You are instructor, You cannot buy any course");
            return;
        }
        if (token){
            //console.log("add to cart karne jaa rhe")
            dispatch(addToCart(course));
            return;
        }
        setConfirmationModal({
            text1:"You are not logged in",
            text2: "Please login to add to cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler:()=> setConfirmationModal(null),
        })
    } */
    const handleShare= ()=>{
        copy(window.location.href);
        toast.success("Link copied to the clipboard");
    }
    //console.log(user)
    return (
        <div className="flex flex-col gap-4 rounded-md bg-richblack-70 p-4 text-richblack-50">
            <img src={thumbnail} 
            className="max-h-[300px] min-h-[180px] w-[400px] oveflow-hidden rounded-2xl object-cover md: max-w-full" />
            <div className="px-4">
                <div className="space-x-3 pb-4 text-3xl font-semibold"> Rs. {price}</div>
                <div className="flex flex-col gap-4">
                    <button
                    className="yellow-button"
                    onClick={
                        user && course.studentsEnrolled.includes(user._id)
                        ?()=> navigate("/dashboard/enrolled-courses")
                        :handleBuyCourse
                    }
                    >
                        
                        {
                            user && course?.studentsEnrolled?.includes(user?._id)
                            ? "Go to Course": "Buy Now"
                        }
                    </button>
                    {
                        (user && !course.studentsEnrolled.includes(user._id)) && (
                            <button onClick={handleAddToCart}
                            className="black-button">
                                Add To Cart
                            </button>
                        )
                    }
                </div>    
            </div>
            
            <div className="">
                <p className="pb-3 pt-6 text-senter text-sm text-richblack-25">
                    30-day Moneyback Guarantee
                </p>
                <p className="my-2 text-xl font-semibold">
                    This course includes:
                </p>
                <div className="flex flex-wrap gap-12 text-sm text-caribbeangreen-100">
                    {
                        course?.instructions.map((item,index)=>(
                            <p key={index} className="flex gap-1 items-center">
                                <BsFillCaretRightFill />
                                <span>{item}</span>
                            </p>
                        ))
                    }
                </div>
                <div className="text-center">
                    <button onClick={handleShare}
                    className="mx-auto flex items-center gap-2 py-6 text-yellow-100">
                        <FaShareSquare size={15} />
                        Share
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CourseDetailsCard;