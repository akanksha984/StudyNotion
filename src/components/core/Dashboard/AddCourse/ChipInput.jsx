import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux"

const ChipInput= ({label,name,placeholder,register,errors,getValue,setValue})=>{
    const {editCourse,course}= useSelector((state)=>state.course);
    const [chips,setChips]= useState([]);

    useEffect(()=>{
        if (editCourse){
            setChips(course?.tags);
        }
        register(name,{required:true, validate: (value)=>value.length>0})
    },[]);
    useEffect(()=>{
        setValue(name,chips);
    },[chips]);

    //function to handle user input when chips are added
    const handleKeyDown= (event)=>{
        // check if enter or comma key is pressed
        if (event.key=== "Enter" || event.key===','){
            event.preventDefault();
            // remove the trailing or leading spaces
            const chipValue= event.target.value.trim();
            if (chipValue && !chips.includes(chipValue)){
                // add the chip and clear the input
                const newChips= [...chips,chipValue];
                setChips(newChips);
                event.target.value="";
            }
        }
    }

    //function to handle deletion of the chips
    const handleDeleteChip= (chipIndex)=>{
        // filter chips array to remove chip with given index
        const newChips= chips.filter((_,index)=>index!==chipIndex);
        console.log(newChips)
        setChips(newChips);
    }

    return (
        <div>
            <label htmlFor={name} className="label-style">
                {label} <sup className="text-pink-200">*</sup>
            </label>
            {/* render the chips */}
            <div className="flex w-full flex-wrap gap-y-2">
            {
                chips.map((chip,index)=>(
                    <div key={index} className="flex items-center m-1 py-1 rounded-full bg-yellow-200 px-2 text-sm text-richblack-5">
                        {chip}
                        <button type="button" className="ml-2 focus:outline-none"
                        onClick={()=>handleDeleteChip(index)}>
                            <MdClose className="text-sm" />
                        </button>
                    </div>
                ))
            }

            {/* render the input tag */}
            <input id={name} name={name} type="text" placeholder={placeholder} 
            onKeyDown={handleKeyDown}
            className="input-style"
            />
            {
                errors[name] && (
                    <span class="error-style">
                        {label} is required
                    </span>
                )
            }
            </div>
        </div>
    )
}

export default ChipInput;