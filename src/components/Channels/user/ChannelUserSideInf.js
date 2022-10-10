import React, { useEffect, useState  } from "react";


import RuleSideItem from "../owner/RuleSideItem"
import { Link } from "react-router-dom";
import {
  getWriteContract,

  joinChannel} from "../../../Web3Api/Web3"

import { ErrorToast,SuccessToast } from "../../toast/toast";
import { backendPostRequest } from "../../../axios/backendRequest";
import { getUserProfile } from "../../../Web3Api/Web3";
export default function SideUserInf({account,
                          chainId,
                          active ,
                          channelDBInf,
                          channelInf,
                          submitting, 
                          setSubmitting,setIsOpenSwitchNetworkModal
}) {
 
  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")

  const [joinedState,setJoinedState]=useState(false)

 
  const [createdTime, setCreatedTime]=useState("")
  const [jointUsers,setJointUsers]=useState([]);
  useEffect(()=>{  
    if(channelInf){  
      var  date =new Date(channelInf.timestamp*1000);     
      setCreatedTime(date.toLocaleString('sv'))
      setJoinedState(channelInf.joined)
      getChannelJoinedUsers()
    }
  },[ channelInf])
  useEffect(()=>{

  },[joinedState])
 //////channelJoin
  async function joinCommuntyChannel(){
    if(!account||!active||channelDBInf.chainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,channelDBInf.chainId.toString()]);
      return
    }
    if(joinedState)
    setSubmitting("joiningout")
    else
    setSubmitting("joining")

    var res = await joinChannel(chainId,MyBoardContract, account,channelDBInf.channelId )
    if(res=="success"){
      if(joinedState)
      SuccessToast("Joined out successfully")
      else{
        SuccessToast("Joined successfully")
      }
    }
    else{
      if(joinedState)
      ErrorToast("Join out Failed")
      else
      ErrorToast("Join Failed")
    }
    setSubmitting("ready")
    setJoinedState(!joinedState)
  }

async function getChannelJoinedUsers(){
  var formData= new FormData()
  formData.append('channelId',channelDBInf.channelId);
  formData.append('network',channelDBInf.network);
  formData.append('contractaddress',channelDBInf.contractaddress);
  formData.append('offset',0);
  var res =await backendPostRequest("channel/joinedusers",formData);   

  if(res.status==200){
    if(res.data){
      var memberusers=[];
     
      for(let user of   res.data.joinusers){      
        var seluser=await getUserProfile(user.joiner);
        memberusers.push(seluser)
      }
  
      setJointUsers(memberusers)
    }
  }


}



  return (
    <>
     
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-16">
        <div className="rounded-t bg-blue-500 mb-0 px-6 py-3"
        style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold">About Community</h6>
    
          </div>
        </div>
        <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
          <div className="flex flex-wrap">
            <div className="w-full  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left flex items-center mt-2 mb-4">
              <span className="w-12 h-12 text-xl text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
                style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
                {channelInf.inf.appearance.iconImg_Url==""&&(
                  <>  {"r/"+channelInf.name.substr(0,1)}</>
                )}
                {channelInf.inf.appearance.iconImg_Url!=""&&(
                <img
                    src={`https://ipfs.io/ipfs/${channelInf.inf.appearance.iconImg_Url}`}
                    // className="h-12 w-12 bg-white rounded-full border"
                    className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                    alt="..."
                  ></img>
                )}
              </span>
              <span className="ml-3 font-bold text-blueGray-600 text-sm ">
                {channelInf.name}
              </span>
            </div>
          </div>
        

          
          <div className="flex flex-wrap">
            <div className="w-full ">
              <div className="relative w-full mb-3">
                <label
                  className="block  text-blueGray-600 text-sm  mt-1 "
                 
                >
                  this channel is for testing
                  
                </label>
                
              </div>
             
            </div>
          </div>
          
          <hr className="mt-1 border-b-1 border-blueGray-300" />
          <div className="w-full  text-center ">
            <div className="flex justify-left py-2 lg:pt-2 pt-3">
              <div className="mr-4 pr-4  text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {channelDBInf.postedmembers}
                </span>
                <span className="text-sm text-blueGray-400"> Members</span>
              </div>
              <div className="mr-4 pr-4  text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {channelInf.joincount}
                </span>
                <span className="text-sm text-blueGray-400">Joined</span>
              </div>
              <div className="mr-4 pr-4   text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {channelInf.postcount}
                </span>
                <span className="text-sm text-blueGray-400">posts</span>
              </div>
              
            </div>
          </div>
          <hr className="mt-1 border-b-1 border-blueGray-300" />
          <div className="relative w-full mt-2">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                <i className=" text-blueGray-400 fas fa-clock text-sm "></i>  created on { createdTime} 
               {" "} by 
               <Link className="text-black" to={`/user/${channelDBInf.creator}`} >{" "+channelDBInf.creator.substr(0,6)+"..."+channelDBInf.creator.substr(38)}</Link>
              </label>
          </div>
          <hr className="mt-1 border-b-1 border-blueGray-300" />
        
          <div className="relative w-full mt-2">
            <label
              className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Community topics
            </label>
            <div className="relative w-full mb-3 ">
              
              {channelInf.inf.topics.map((topic, i)=>{
                  return(
                    <span
                    key={"topic"+i}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{topic}</span>
                  )
                })}                  
              
            </div>

            
          </div>
          <div className="flex flex-wrap">           
            <div className="relative w-full mb-3 text-center mt-6  ">
            
                {!joinedState&&(
                <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-blue-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                  onClick={joinCommuntyChannel}>
                  <span className="w-full text-xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    JOIN
                  </span>
                </button>
                )}
                {joinedState&&(
                <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                onClick={joinCommuntyChannel}>
                  <span className="w-full text-xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    JOINED
                  </span>
                </button>
                )}
        
          </div>
        </div>
        
          {/* <hr className="mt-1 border-b-1 border-blueGray-300" />
          <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            
                create post
            
          </button> */}
        </div>
      </div>
      {joinedState&&(
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-16">
          <div className="rounded-t  mb-0 px-3 py-6 bg-blue-500"
           style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
            <div className="text-center flex justify-start">
              <h6 className="text-white text-xl font-bold">Moderators</h6>
            
            </div>
          </div>
          <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
            {/* <div className="flex flex-wrap">           
                <div className="relative w-full mb-3 text-center mt-6  ">
                     
                    <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                      <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        send message
                      </span>
                    </button>
            
              </div>
            </div> */}
            {jointUsers.length>0&&(
                <div className="relative w-full mt-2">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Join users
                  </label>
              
                  {jointUsers.map((memberuser,i)=>{  
                        
                    return(                 
                      
                        <div className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2  text-left flex items-center">
                          <span className="w-10 h-10 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                            <img
                                src={`https://ipfs.io/ipfs/${memberuser.profileImgUrl}`}
                                // className="h-12 w-12 bg-white rounded-full border"
                                className="w-full w-10 h-10 rounded-full align-middle border-none shadow-lg"
                                alt="..."
                              ></img>
                          </span>
                            <span className="ml-3 font-bold text-blueGray-600 text-lg">
                              {memberuser.username}
                              ({memberuser.address.substring(0,6)+"..."+memberuser.address.substring(38)})
                            </span>
                        </div>                    
                    
                      )
                  })}
                </div>
              )}  
            
        
    
          
            
            <div className="relative w-full mt-2">
              <div className="text-center flex justify-end">
              
                <Link
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                
                  to={`/channel/${channelDBInf.channelId}/owner/users/morderators`}
                >
                  view all moderators
                </Link>
              </div>
            </div>    
          </div>
        </div>
      )}
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-16">
        <div className="rounded-t  mb-0 px-6 py-3 bg-blue-500"
         style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
          <div className="text-center flex justify-start">
            <h6 className="text-white text-xl font-bold">Rules</h6>
           
          </div>
        </div>
        <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
          
         <div className="relative w-full mt-2">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg  bg-white">
          
              <div className="block w-full overflow-x-auto">
                {/* Projects table */}
                {channelInf.inf.rules.length>0&&(
                  <div id="accordion-collapse" >
                    {channelInf.inf.rules.map((rule,i)=>{
                      return (<RuleSideItem no={i+1} rule={rule}/>
                        )
                      })}
                  
                  </div>
                )}
              </div>
            </div>
          </div>
          
      
   
        
         
        </div>
      </div>
     
    </>
  );
}
