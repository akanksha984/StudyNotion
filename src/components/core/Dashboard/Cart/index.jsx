import { useSelector } from "react-redux";
import RenderCartCourses from "./RederCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";


const Cart=()=>{
    const {totalItems,totalPrice}= useSelector((state)=>state.cart);
    const {paymentLoading}= useSelector((state)=>state.course);
    if (paymentLoading){
        return (
            <div>
                <div>Spinner here</div>
            </div>
        )
    }
    return(
        <div>
            <div>
                <h1 className="mb-14 text-3xl font-medium text-richblack-5">
                    Your Cart
                </h1>
                <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
                    {totalItems} courses in your cart
                </p>
                {
                    totalItems>0 
                    ?(
                        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
                            <RenderCartCourses/>
                            <RenderTotalAmount />
                        </div>
                    )
                    :(
                        <div className="italic mt-14 text-center text-richblack-100 text-2xl">
                            Your cart is empty...
                            go to enrolled courses button 
                            go to catalog page button
                        </div>
                    )
                }
            </div> 
        </div>
    )
}

export default Cart;