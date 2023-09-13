import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../common/RatingStars"
import avgRating from "../../../utils/avgRating"

const CourseCard= ({course,Height})=>{
    const [avgReviewCount,setAvgReviewCount]= useState(0);
    useEffect(()=>{
        const count= avgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course]);
    return (
        <div>
            {/* {console.log("course is",course)} */}
            <Link to={`/course/${course._id}`}>
                <div>
                    <div className="rounded-lg">
                        <img src={course.thumbnail} alt={course.courseName}
                        className={`${Height} w-full rounded-xl object-cover`}></img>
                    </div>
                    <div className="flex flex-col gap-2 px-1 py-3 font-semibold">
                        <p className="text-xl text-richblack-5">
                            {course.courseName}
                        </p>
                        <p className="text-sm text-richblack-100">
                            {course.instructor.firstName} {course.instructor.lastName}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-5">{avgReviewCount || 0}</span>
                            <RatingStars reviewCount={avgReviewCount} />
                            <span className="text-yellow-50">{course.ratingAndReviews.length} Ratings</span>
                        </div>
                        <p className="text-xl text-richblack-5">Rs. {course.price}</p>
                        {/* {
                            console.log(course)
                        } */}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default CourseCard;