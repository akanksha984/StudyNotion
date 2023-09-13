import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux"
import {FiUploadCloud} from "react-icons/fi";
import {useDropzone} from "react-dropzone";
import "video-react/dist/video-react.css"; 
import {Player} from "video-react";

const UploadWithPreview= ({name,label,setValue,register,errors,video=false,viewData=null,editData=null})=>{
    
    const {course,setCourse}= useSelector((state)=>state.course);
    const [selectedFile,setSelectedFile]= useState(null);
    const [previewSource,setPreviewSource]= useState(
        viewData?viewData :editData?editData:""
    )
    const inputRef= useRef(null)
    const onDrop= (acceptedFiles)=>{
        const file= acceptedFiles[0]
        if (file){
            previewFile(file);
            setSelectedFile(file)
        }
    }

    const {getRootProps, getInputProps, isDragActive}= useDropzone({
        accept: !video
        ? {"image/*":[".jpeg",".jpg",".png"]}
        : {"video/*":[".mp4"]},
        onDrop,
    })

    const previewFile= (file)=>{
        const reader= new FileReader();
        reader.readAsDataURL(file)
        reader.onload=()=>{
            setPreviewSource(reader.result);
        }
    }

    useEffect(()=>{
        register(name,{required: true})
    },[register])

    useEffect(()=>{
        setValue(name,selectedFile);
    },[selectedFile,setValue])
    return (
        <div className="flex flex-col space-y-2">
            <label className="label-style" htmlFor={name}>
                {label} {!viewData && <sup className="text-pink-200">*</sup>}
            </label>
            <div className={`${isDragActive?"bg-richblack-700":"bg-richblack-800"}
            min-h-[250px] flex cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblue-300`}>
                {
                    previewSource?(
                        <div className="flex flex-col p-6 h-full">
                            {
                                !video?(
                                    <img src={previewSource} alt="preview"
                                    className="h-full w-full rounded-md object-cover" />
                                ):(
                                    <Player aspectRatio="16:9" playsInline src={previewSource} />
                                )
                            }
                            {
                                !viewData && (
                                    <button type="button" 
                                    onClick={()=>{
                                        setPreviewSource("")
                                        setSelectedFile(null)
                                        setValue(name,null)
                                    }}
                                    className="mt-3 text-richblack-400 underline"
                                    >
                                        Cancel
                                    </button>
                                )
                            }
                        </div>
                    ):(
                        <div 
                        className="flex w-full flex-col items-center p-6"
                        {...getRootProps()}>
                            <input {...getInputProps()} ref={inputRef} />
                            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-700">
                                <FiUploadCloud className="text-2xl text-yellow-200" />
                            </div>
                            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                                Drag and drop {!video?"an image":"a video"}, or click to {" "}
                                <span className="font-semibold text-yellow-50"> Browse </span>
                                    a file
                                </p>
                            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                                <li> Aspect ratio 16:9</li>
                                <li>Recommended size 1024x576</li>
                            </ul>
                           
                        </div>
                    )
                }
            </div>
            {
                errors[name] && (
                    <span className="error-style">
                        Thumbnail is required
                    </span>
                )
            }
        </div>
    )
}

export default UploadWithPreview