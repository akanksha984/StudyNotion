import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { buyCourse } from "../../../../services/operations/StudentFeatures";
import { useNavigate } from "react-router-dom";

const RenderTotalAmount= ()=>{
    const {totalPrice, cart}= useSelector((state)=>state.cart);
    const {token}= useSelector((state)=>state.auth);
    const {user}= useSelector((state)=>state.profile);
    const dispatch= useDispatch();
    const navigate= useNavigate();
    const buyHandler= ()=>{
        //console.log("buy handler mein hai")
        //console.log("go to payment integration")
        const courses= cart.map((course)=>course._id);
        buyCourse(token, courses, user, navigate, dispatch);
    }
    return (
        <div className="min-w-[280px] bg-richblack-800 rounded-md border-2 border-richblack-700 p-6 tracking-widest">
            <p className="mb-1 text-xl font-medium text-richblack-300">Total</p>
            <p className="mb-6 text-2xl font-medium text-yellow-100">Rs {totalPrice}</p>

            <IconBtn
            text="Buy Now"
            onClick= {buyHandler}
            customClasses={"w-full justify-center"}
            />
        </div>
    )
}

export default RenderTotalAmount;