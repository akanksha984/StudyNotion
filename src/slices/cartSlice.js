import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast";

const initialState= {
    cart: localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[],
    totalPrice: localStorage.getItem("totalPrice")?JSON.parse(localStorage.getItem("totalPrice")):0,
    totalItems: localStorage.getItem("totalItems")?JSON.parse(localStorage.getItem("totalItems")):0
};

const cartSlice= createSlice({
    name: "cart",
    initialState: initialState,
    reducers:{
        addToCart: (state,action)=>{
            const course= action.payload;
            const index= state.cart.findIndex((item)=>(item._id)===course._id);
            if (index>=0){
                // course is already present at index in the cart
                toast.error("Course is already in your cart");
                return;
            }

            // if course is not in the cart, then add the course to cart
            state.cart.push(course);
            state.totalItems++;
            state.totalPrice+= course.price;
            // update the local storage
            localStorage.setItem("cart",JSON.stringify(state.cart));
            localStorage.setItem("totalPrice",JSON.stringify(state.totalPrice));
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems));

            toast.success("Course Added to your cart successfully !");
        },
        removeFromCart:(state,action)=>{
            const course= action.payload;
            const index= state.cart.findIndex((item)=>{return item._id===course._id});
            //console.log(index);
            if (index>=0){
                //item is present in the cart
                console.log("removing from cart..");
                state.totalItems--;
                state.totalPrice-= state.cart[index].price;
                state.cart.splice(index,1);
                // update the local storage
                localStorage.setItem("cart",JSON.stringify(state.cart));
                localStorage.setItem("totalPrice",JSON.stringify(state.totalPrice));
                localStorage.setItem("totalItems",JSON.stringify(state.totalItems));
                // show toast
                toast.success("Course Removed from the cart successfully!");
            }
        },
        resetCart:(state)=>{
            state.cart=[];
            state.totalItems=0;
            state.totalPrice=0;
            // update the local storage
            localStorage.removeItem("cart");
            localStorage.removeItem("totalItems");
            localStorage.removeItem("totalPrice");
        }
    }
});

export const {addToCart,removeFromCart,resetCart}= cartSlice.actions;
export default cartSlice.reducer;


