import React, { useEffect, useState,useRef }  from "react";
import PayModal from "../modal/PayModal"
export default function({      setPrivateKey,  
  privateKeyChecking,
}){
  

  return(
    <div className="w-full lg:w-8/12 px-4 mt-12">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded xl:mb-0 shadow-lg">
        <form onSubmit={privateKeyChecking}>
          <div className="flex-auto pl-8 pr-8 pt-10">
            <div className="flex flex-wrap">
              <div className="relative w-full mb-1">
                <label
                  className="block  text-blueGray-600 text-lg font-bold mb-2"
                  htmlFor="grid-password"
                >
                  You must input private key in order to view this post
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="private key" required
                  onChange={(e)=>{setPrivateKey(e.target.value)}}
                />
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      
                      </h6>
                    <button
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="submit"
                      
                    >
                    check
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

  )
}