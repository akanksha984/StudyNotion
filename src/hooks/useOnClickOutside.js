import { useEffect } from "react";

export default function useOnClickOutside(ref,handler){
    useEffect(()=>{
        // define listener function to be calle on touch or click events
        const listener= (event)=>{
            // if the click or touch event originated inside the ref element, do nothing
            if (!ref.current || ref.current.contains(event.target)){
                return;
            }
            // otherwise call the handler funxtion
            handler(event);
        };

        // add event listeners for the mousedown and touchstart events on the document
        document.addEventListener("mousedown",listener);
        document.addEventListener("touchstart",listener);

        // clean function to remove the event listeners when the components unmounts or when the ref/handler dependencies change
        return ()=>{
            document.removeEventListener("mousedown",listener);
            document.removeEventListener("touchstart",listener);
        }
    })
}