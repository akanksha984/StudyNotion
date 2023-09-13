import React, { useEffect, useState } from 'react'
import { apiConnector } from '../../services/apiconnector';
import {ratingEndpoints} from "../../services/apis"
import {Swiper,SwiperSlide} from 'swiper/react';
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {FreeMode, Pagination, Autoplay, Navigation} from "swiper/modules";
import ReactStars from "react-rating-stars-component"
import { FaStar } from 'react-icons/fa';

const ReviewSlider = () => {
    const [reviews,setReviews]= useState([]);
    const trancateWords= 15;
    useEffect(()=>{
        const fetchAllReviews= async()=>{
            var response= await apiConnector("GET",ratingEndpoints.REVIEWS_DETAILS_API);
            response= response.data;
            if (response.success){
                setReviews(response.data);
            }
            //console.log(reviews);
        }
        fetchAllReviews();
    },[]);
    return (
        <div className='text-white'>
            <div className='my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent'>
                <Swiper
                slidesPerView={4}
                spaceBetween={24}
                loop={true}
                freeMode={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[FreeMode,Pagination,Autoplay]}
                className='w-full'
                >
                    {
                        reviews.map((review,index)=>{
                            return (
                                <SwiperSlide key={index}>
                                    <div className='flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 border border-richblack-700 rounded-md'>
                                        <div className='flex items-center gap-4'>

                                        </div>
                                        <img src={review.user.image} alt={`${review.user.firstName} ${review.user.lastName}`}
                                        className='h-9 w-9 rounded-full object-cover' />
                                        <div className='flex flex-col'>
                                            <p className='font-bold text-richblack-5 text-md'>{review.user.firstName} {review.user.lastName}</p>
                                            <p className='text-[12px] font-medium text-richblack-400'>~{review.course.courseName}</p>
                                            <p className='font-medium text-richblack-25'>
                                                {review.review.split(" ").length> trancateWords
                                                ? `${review.review.split(" ").slice(0,trancateWords).join(" ")} ...`
                                                :`${review.review}`}
                                            </p>
                                            <div className='flex items-center gap-2'>
                                                <p className="font-semibold text-yellow-100">
                                                    {review.rating}
                                                </p>
                                                <p>
                                                    <ReactStars
                                                        count={5}
                                                        value={review.rating}
                                                        size={20}
                                                        edit={false}
                                                        activeColor="#ffd700"
                                                        emptyIcon={<FaStar/>}
                                                        fullIcon={<FaStar/>}
                                                    />
                                                </p>     
                                            </div>
                                               
                                        </div>
                                        
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }

                </Swiper>    
            </div>
            
        </div>
    )
}

export default ReviewSlider