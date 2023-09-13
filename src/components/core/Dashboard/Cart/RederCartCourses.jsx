import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import {AiFillStar,AiOutlineStar} from "react-icons/ai";
import {RiDeleteBin6Line} from "react-icons/ri";
import { removeFromCart } from "../../../../slices/cartSlice";

const RenderCartCourses= ()=>{
    const {cart}= useSelector((state)=>(state.cart));
    const dispatch= useDispatch();
    return (
        <div className="flex flex-col flex-1">
        {
            cart.map((course,index)=>(
                <div key={index}
                className={`flex w-full flex-wrap items-start justify-between gap-6 
                ${index!==0 && "mt-6"} ${index!==cart.length-1 && "border-b border-b-richblack-500 pb-6"}`}>
                    <div className="flex flex-1 flex-col gap-4 xl:flex-row justify-between">
                        <img src={course?.thumbnail} alt={`${course.courseName}`} 
                        className="h-[148px] w-[220px] rounded-lg object-cover"/>
                        <div className="flex flex-col space-y-1">
                            <p className="text-lg text-richblack-5 font-semibold">
                                {course?.courseName}
                            </p>
                            <p className="text-sm text-richblack-200">
                                {course?.category?.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-5">
                                    4
                                    {/* rating here!!! */}
                                </span>
                                <ReactStars
                                count={5}
                                value={4}   //{course.ratingAndReviews.length}
                                size={20}
                                edit={false}
                                activeColor= "#ffd700"
                                emptyIcon={<AiOutlineStar/> }
                                fullIcon={<AiFillStar/> }
                                 />
                                 <span className="text-richblack-300">{course?.ratingAndReviews?.length} Ratings</span>
                            </div>
                        </div>
                        <div>
                            <button 
                            onClick={()=>{dispatch(removeFromCart(course))}}
                            className="flex items-center gap-x-1 rounded-md bg-richblack-700 border border-richblack-600 py-1 px-[10px] text-pink-100"
                            >
                                <RiDeleteBin6Line/>
                                <span>Remove</span>
                            </button>
                            <p className="mt-3 text-lg font-semibold text-yellow-100">
                                Rs {course?.price}
                            </p>
                        </div>
                    </div>
                </div>
            ))
        }
        </div>
    )
}

export default RenderCartCourses;