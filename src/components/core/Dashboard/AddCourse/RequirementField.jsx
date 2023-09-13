import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const RequirementField= ({name,label,register,setValue,getValues, errors})=>{
    const [requirement, setRequirement]= useState("");
    const [requirementList,setRequirementList]= useState([]);
    const {editCourse,course}= useSelector((state)=>state.course)
    const handleAddRequirement= ()=>{
        if (requirement){
            setRequirementList([...requirementList,requirement]);
            setRequirement("");
        }
    }
    const handleRemoveRequirement= (index)=>{
        const updatedRequirementList= [...requirementList];
        updatedRequirementList.splice(index,1);
        setRequirementList(updatedRequirementList);
    }

    useEffect(()=>{
        if (editCourse){
            setRequirementList(course?.instructions);
        }
        register(name,{
            required: true,
           validate: (value)=>value.length>0
        })
    },[]);  //register on first render

    useEffect(()=>{
        setValue(name,requirementList);
        //console.log(requirementList)
    },[requirementList])

    return (
        <div className="flex flex-col space-y-2">
            <label htmlFor={name} className="label-style">{label}<span className="text-pink-200">*</span></label>
            <div className="flex flex-col items-start space-y-2">
                <input
                type="text"
                id={name}
                value={requirement}
                onChange={(e)=>setRequirement(e.target.value)}
                className="input-style"
                />
                <button type="button" onClick={handleAddRequirement}
                className="font-semibold text-yellow-50 tracking-wide border-[1px] border-yellow-400 py-1 px-2 rounded-md">
                   + Add
                </button>
            </div>
            {
                requirementList.length>0 && (
                    <ul className="mt-2 list-inside list-disc">
                        {
                            requirementList.map((item,index)=>(
                                <li key={index} className="flex items-center text-richblack-5">
                                    <span>{item}</span>
                                    <button type='button' onClick={()=>handleRemoveRequirement(index)}
                                    className="ml-2 text-xs italic text-pure-greys-300">
                                        Remove
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
            {
                errors[name] && (
                    <span className="error-style">
                        {label} is required
                    </span>
                )
            }
        </div>
    )
}

export default RequirementField;
