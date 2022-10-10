
import React,{useState,useEffect} from "react";
import { backendPostRequest } from "../../../axios/backendRequest";
import { getUserProfile } from "../../../Web3Api/Web3";
export default function PostedUsers({account,chainId, channelDBInf,active,channelId,color, channelInf }) {  
  
  const [jointUsers,setJointUsers]=useState([]);

  useEffect(()=>{
    if(active&&channelInf){
      getChannelJoinedMembers(true);
    }
  
  },[channelInf,active])

  async function getChannelJoinedMembers(newselect){
    var skip=0;   
    if(!newselect &&setJointUsers.length>0){
       skip=setJointUsers.length;
    }   

    var formData= new FormData()
    formData.append('channelId',channelDBInf.channelId);
    formData.append('network',channelDBInf.network);
    formData.append('contractaddress',channelDBInf.contractaddress);
    formData.append('offset',skip);
    var res =await backendPostRequest("channel/postedusers",formData);   
  
    if(res.status==200){
      if(res.data){
        var memberusers=[];
      
        for(let user of  res.data.creators){      
          var seluser=await getUserProfile(user.creator);
          memberusers.push(seluser)
        }
     
       
        if(newselect){
          setJointUsers(memberusers)
        }else{       
          var newUsers=jointUsers.concat(memberusers)           
          setJointUsers(newUsers)      
        }     
        
    
      }
    }
  }
  function showMore(){
    getChannelJoinedMembers(false)
  }
  
  return (
    <>
      <div
        className=
          "relative flex flex-col min-w-0 break-words w-full mb-6  rounded "
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 bg-green-600 mb-2">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3  className= "font-semibold text-lg text-white " >
                Posted Members
              </h3>
            </div>
          </div>
        </div>
          <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color == "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        {/* <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="p-4">
                <label for="table-search" className="sr-only">Search</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
                    </div>
                    <input type="text" id="table-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
                </div>
            </div>
          </div>
        </div> */}
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className=
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                 >
                  No
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color == "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Username
                </th>
                <th
                  className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"                    
                
                >
                  Address
                </th>               
               
                {/* <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color == "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Completion
                </th> */}
                
              </tr>
            </thead>
            {jointUsers.length>0&&(
              <tbody>
                {jointUsers.map((memberuser,i)=>{                 
                  return(
                    <tr className="border-b-0">
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center">
                        {i+1}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                        <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                          <img
                              src={`https://ipfs.io/ipfs/${memberuser.profileImgUrl}`}
                              // className="h-12 w-12 bg-white rounded-full border"
                              className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                              alt="..."
                            ></img>
                        </span>
                          <span className="ml-3 font-bold text-blueGray-600">
                            {memberuser.username}
                          </span>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      
                        <span
                          className="ml-3 font-bold text-blueGray-600" 
                        >
                         {memberuser.address}
                        </span>
                      </td>
                      
                     
                      
                      {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex">
                          <button className="text-lightBlue-500 background-transparent font-bold uppercase py-3 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                              add as Moderators
                          </button>
                          
                          </div>
                      </td> */}
                    </tr>
                    )
                })}
              </tbody>
            )}
          </table>
        </div>
        
      </div>

      {channelInf ?(
          <>
       
            <div className="flex flex-wrap justify-center">
              <button className="text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                  onClick={showMore}
                  >
                show more
              </button>
            
            </div> 
          
          </>):(<></>) 
        }
      </div>
    </>
  );
}

