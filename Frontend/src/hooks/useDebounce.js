import { useState, useEffect } from "react";

export const useDebounce = (value, delay = 500) => {
     const [ debounceValue, setDebouncedValu] = useState(value);

     useEffect(() =>{
          const handler = setTimeout(() =>{
               setDebouncedValu(value);
          }, delay);

     return () =>{
          clearTimeout(handler);
     };
     },[value, delay]);
     return debounceValue;
}