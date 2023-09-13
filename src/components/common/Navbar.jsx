import Logo from"../../assets/Logo/Logo-Full-Light.png";
import { Link } from "react-router-dom";
import {NavbarLinks} from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { matchPath } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import {AiOutlineShoppingCart} from "react-icons/ai"
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { useEffect, useState } from "react";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiconnector";
import {IoIosArrowDown} from "react-icons/io";

const Navbar= ()=>{
    const location= useLocation();
    const matchRoute= (route)=>{
        return matchPath({path:route},location.pathname);
    }

    const {token}= useSelector((state)=>state.auth);
    const {user}= useSelector((state)=>state.profile);
    const {totalItems}= useSelector((state)=>state.cart);

    const [subLinks,setSubLinks]= useState([]);
    const fetchSubLinks= async()=>{
                                try{
                                    const result= await apiConnector("GET",categories.CATEGORIES_API);
                                    //console.log("Printing sublinks results", result);
                                    setSubLinks(result.data.data);
                                }catch(error){
                                    console.log("Could not fetch the category list", error.message);
                                }
                            }
    useEffect(()=>{
        fetchSubLinks();
    },[])

    return (
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblue-700">
            <div className="w-11/12 max-w-maxContent flex items-center justify-between">
                <Link to="/">
                    <img src={Logo} width={160} height={42} loading="lazy"></img>
                </Link>

                <nav>
                    <ul className="flex flex-row gap-x-6 text-richblack-25">
                        {
                            NavbarLinks.map((link,index)=>(
                                <li key={index}>
                                    {
                                        link.title === "Catalog" 
                                        ?(<div className="flex items-center gap-2 group relative cursor-pointer">
                                            {/* api call */}
                                            <p>{link.title}</p>
                                            <IoIosArrowDown/>

                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                            {   
                                                subLinks.length
                                                ?(
                                                    subLinks/* .filter((sublink)=>sublink?.course?.length>0) */
                                                    .map((sublink,index)=>(
                                                        <>
{/*                                                         {console.log(sublink)} */}
                                                        <Link to={`/catalog/${sublink.name.split(" ").join("-").toLowerCase()}`} 
                                                        key={index}>
                                                            <p>
                                                                {sublink.name}
                                                            </p>
                                                        </Link></>
                                                    ))
                                                )
                                                :(<div></div>)
                                            }
                                            </div>
                                            
                                        </div>)
                                        :(
                                            <div>
                                                <Link to={link?.path}>
                                                    <p className={`${matchRoute(link?.path)?"text-yellow-25 font-semibold":"text-richblack-25"} hover:text-yellow-25 duration-200`}>{link.title}</p>
                                                </Link>
                                            </div>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>
                </nav>

                {/* login signup dashboard */}
                <div className="flex gap-2">
                    {
                        user && user?.accountType!=="Instructor" && (
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart/>
                                {
                                    totalItems>0 && (
                                        <span>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token===null && (
                            <Link to="/login">
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                                    Log in
                                </button>
                            </Link>
                        )
                    }
                    {
                        token===null && (
                            <Link to="/signup">
                                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                                    Sign up
                                </button>
                            </Link>
                        )
                    }
                    {
                        token!==null && <ProfileDropDown/>
                    }
                </div>
            </div>

        </div>
    )
}
export default Navbar;