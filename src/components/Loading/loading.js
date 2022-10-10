import React, { useState,useEffect } from "react";
export default function Submitting({
  title
}) {
  return(
    <>
    <div
       className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
     
     >
       <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="spinner">
            <span>{title}...</span>
            <div className="half-spinner"></div>
          </div>
        
       </div>
     </div>
     <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}