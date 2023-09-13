import {Swiper, SwiperSlide} from "swiper/react"
import CourseCard from "./CourseCard";
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {FreeMode, Pagination, Autoplay, Navigation} from "swiper/modules";

const CourseSlider= ({Courses})=>{
    //console.log("swipper dataa", Courses);
    return (
        <>
            {
                
                Courses.length?
                (
                    <Swiper
                    loop={true}
                    slidesPerView={1}
                    spaceBetween={30}
                    /* className="mySwiper" */
                    modules={[Pagination,Autoplay,Navigation,FreeMode]}
                    pagination={true}
                    autoplay={{delay: 1000, disableOnInteraction: false}}
                    navigation={true}
                    breakpoints={{
                        1024: {slidesPerView:3,}
                    }}
                    className="max-h-[30rem]"
                    >
                        {
                            Courses.map((course,index)=>{
                                 return (
                                 <SwiperSlide key={index}>
                                    <CourseCard course={course} Height={"h-[250px]"} />
                                    {/*
                                    {
                                        console.log("swiper class",course)
                                    } */}
                                </SwiperSlide>)
                            })
                        }
                    </Swiper>
                )
                :(
                    <div className="text-xl text-richblack-5 italic">
                        No Course Found ...
                    </div>
                )
            }
        </>
    )
}

export default CourseSlider;