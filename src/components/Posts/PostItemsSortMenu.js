import React, { useEffect,useState } from "react";

export default function PostItemsSortMenu({
  statPercentColor,
  setSortType,
  sortType

}) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  // moralis hook
  useEffect(()=>{
 
  },[sortType])



  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-blueGray-100 border-0">
        <div className="w-full ">
          <nav className="relative flex flex-wrap items-center justify-between  py-3 bg-white rounded">
            <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
              <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
                <ul className="flex flex-col lg:flex-row list-none ml-auto">
                  <li className="nav-item">
                    <a className={"px-2 py-2 flex items-center text-xs uppercase font-bold leading-snug 0 hover:opacity-75 text-xl "
                                    +(sortType=="Hot" ?" text-emerald-500" : "text-blueGray-400 ")}
                      onClick={()=>{setSortType("Hot")}}
                      >
                      <i className=" fab fa-hotjar  leading-lg px-1 " />   hot
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className={"px-2 py-2 flex items-center text-xs uppercase font-bold leading-snug  hover:opacity-75 text-xl "
                                    +(sortType=="New" ?  "text-emerald-500" : "text-blueGray-400 ")}
                     onClick={()=>{setSortType("New")}}>
                      <i className="fas fa-certificate leading-lg px-1" />   New
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className={"px-2 py-2 flex items-center text-xs uppercase font-bold leading-snug  hover:opacity-75 text-xl "
                                  +(sortType=="Top" ?  " text-emerald-500" : " text-blueGray-400")}
                     onClick={()=>{setSortType("Top")}} >
                      <i className=" far	fa-chart-bar leading-lg px-1" />   Top
                    </a>
                  </li>
                </ul>
                
              </div>
              
              <div className="flex  items-center " id="example-navbar-info">
                <a className="px-2 py-2 flex items-center text-xs uppercase font-bold leading-snug text-blueGray-400 hover:opacity-75 text-xl">
                  <i className="text-blueGray-400 fas	fa-th-list leading-lg px-1" /> 
                </a>
               
              </div>
              
            </div>
          </nav>
        </div>
      </div>

     

     
     
    </>
  );
}

