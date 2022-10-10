import React, { useEffect, useState,Fragment  } from "react";
import { Link } from "react-router-dom";

import Loading from "../../Loading/loading" ;


import {getDataFromSubGraphApi} from "../../../SubgraphApi/graphApiFunction"
import {getRedditContract,
  getChannelInfExtractFromContract,
joinChannel} from "../../../Web3Api/Web3"
import { ErrorToast,SuccessToast } from "../../toast/toast";
export default function HomeSidePanel({account,
                          currentUserInf,
                          active ,      
                          
                                                   
}) {
 
  const RedditContract=getRedditContract()
  const [filterchannels,setfilterChannels]=useState([]);

  const [submitting,setSubmitting]=useState('ready')

  async function getChannelData( ){   
    var query=  `
      {
        channels {
          channelId
          channelName
          creator
          timestamp
          postcount
          iconIMgUrl
          memberCount
          joinedUserCount
        }     
      }`;
     var results= await getDataFromSubGraphApi(query);
  
     if(results.data && account){     
       for(let channel of results.data.channels){
        var contractinf=await getChannelInfExtractFromContract(account,channel.channelId)  
        channel.joined=false   
        if(contractinf)  
        channel.joined=contractinf.joined      

       }
       console.log(results.data.channels);
      setfilterChannels(results.data.channels)
     }
  }

  useEffect(()=>{  
    if(active)
    getChannelData()
    
  },[active])
  useEffect(()=>{

  },[filterchannels])

 //////channelJoin
 async function joinCommuntyChannel(index){
  if(filterchannels[index].joined)
  setSubmitting("joiningout")
  else
  setSubmitting("joining")
  
  var res = await joinChannel(RedditContract, account,filterchannels[index].channelId )
  if(res=="success"){
    let _channels=filterchannels;
    _channels[index].joined=!filterchannels[index].joined;
    setfilterChannels(_channels)
    if(filterchannels[index].joined)
    SuccessToast("Joined out successfully")
    else{
      SuccessToast("Joined successfully")
    }
  }
  else{
    if(filterchannels[index].joined)
    ErrorToast("Join out Failed")
    else
    ErrorToast("Join Failed")
  }
  setSubmitting("ready")

}




  return (
    <>
     {submitting=="joining"&& (
        <Loading title="Joining..."/>
        ) }
        {submitting=="joiningout"&& (
        <Loading title="oining out"/>
        ) }
        
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-10">
        <div className="rounded-t bg-blue-500 mb-0 px-6 py-3"
        style={{backgroundColor:'gray'}}>
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold">Communities</h6>
    
          </div>
        </div>
        <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
         

           
          {/* <div className="leading-7 text-gray-600 text-base">
            <ul>
              
              {filterchannels.map((channel,i)=>{
                return(
                <li className="py-2 border-b border-gray-400 " key={"channel"+i}>
                  <div className="text-gray-600 leading-6 flex justify-between border-transparent border-b-2 hover:text-gray-800">
                    <div className="w-full  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left flex items-center ">
                      <span className="w-12 h-12 text-xl text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
                        style={{backgroundColor:'blue'}}>
                      
                        <img
                            src={`https://ipfs.io/ipfs/${channel.iconIMgUrl}`}
                            // className="h-12 w-12 bg-white rounded-full border"
                            className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                            alt="..."
                          ></img>
                    
                      </span>
                      <span className="ml-3 font-bold text-blueGray-600 text-sm ">
                        {channel.channelName}
                      </span>
                    </div>
                    <div className="ml-4  text-right flex items-center ">
                      {currentUserInf&&(<>
                      {       
                          channel.joined?
                          (<button className="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                            onClick={()=>joinCommuntyChannel(i)}
                          >
                            joined
                          </button>
                          ) :
                          ( <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-1 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" 
                          onClick={()=>joinCommuntyChannel(i)}>
                            Join
                          </button>)
                         }
                      
                      </>
                      )}
                    </div>
                  </div>
                </li>
                )})
              }        
            </ul>
          </div> */}
          <table className="table-auto w-full">           
            <tbody>              
              {filterchannels.map((channel,i)=>{
                return(
                  <tr className="py-4 border-b border-gray-400 pb-2 " key={"channel"+i}>
                    <td className="w-12 text-center">{i+1}</td>
                    <td>
                      <div className="w-full  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left flex items-center mb-2 mt-2">
                        <span className="w-12 h-12 text-xl text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
                          style={{backgroundColor:'blue'}}>
                        
                          <img
                              src={`https://ipfs.io/ipfs/${channel.iconIMgUrl}`}
                              // className="h-12 w-12 bg-white rounded-full border"
                              className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                              alt="..."
                            ></img>
                      
                        </span>
                        <span className="ml-3 font-bold text-blueGray-600 text-sm ">
                          {channel.channelName.substring(0,17)}
                          {channel.channelName.length>18&&<>...</>}
                        </span>
                      </div>
                    </td>
                   
                  </tr>
                )
                })
              }
            </tbody>
          </table>
          <div className="flex flex-wrap">           
            <div className="relative w-full mb-3 text-center mt-6  ">  
               
                <Link className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                //onClick={joinCommuntyChannel}
                to="/channel/list/all"
                >
                  <span className="w-full text-xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    View All Channels
                  </span>
                </Link>
              
        
          </div>
        </div>
        
          {/* <hr className="mt-1 border-b-1 border-blueGray-300" />
          <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            
                create post
            
          </button> */}
        </div>
        
      </div>
   
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-16">
        <div className="rounded-t  mb-0 px-6 py-3 bg-blue-500"
         style={{backgroundColor:"gray"}}>
          <div className="text-center flex justify-start">
            <h6 className="text-white text-xl font-bold">About RedditDemo</h6>
           
          </div>
        </div>
        <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
          
          <div className="flex flex-wrap">
            <div className="w-full ">
              <div className="relative w-full mb-3">
                <label
                  className="block  text-blueGray-600 text-sm  mt-1 "
                 
                >
                  This site is a test Decentralize social network that uses MyMessage token
                  
                </label>
                
              </div>
             
            </div>
          </div>
          
      
   
        
         
        </div>
      </div>
     
    </>
  );
}
