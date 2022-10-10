import React, { useState,useEffect } from "react";

// components

import ChannelOwnerSideInf from "../../components/Channels/user/ChannelOwnerSideInf";
import ChannelUserSideInf from "../../components/Channels/user/ChannelUserSideInf";
import ChannelPosts from "../../components/Channels/user/ChannelPostList";
import { useParams,Link  } from 'react-router-dom';

import  Loading from "../../components/Loading/loading";
import {getChannelInf} from "../../Web3Api/Web3"

import { backendPostRequest } from "../../axios/backendRequest";
export default function PostListView({  account, active,chainId,currentUserProfile,setIsOpenSwitchNetworkModal}) { 
  const { channeldid } = useParams();
  const[submitting, setSubmitting]=useState('ready') 
  const [channelInf, setChannelInf]=useState(null)
  const [channelDBInf, setChannelDBInf]=useState(null)
  useEffect(()=>{  
    if(channeldid){     
      getChannelDBInformation()
    }
  },[ active,channeldid])
  useEffect(()=>{
    if(channelDBInf){
      getChannelInformation()
    }
  },[channelDBInf])
  useEffect(()=>{},[setChannelInf])
  async function getChannelDBInformation(){
    var formData= new FormData()
    formData.append('did',channeldid);
    var res =await backendPostRequest("channel/detail",formData);   
    if(res.status==200){
      if(res.data.channel){
        setChannelDBInf(res.data.channel)
      }
    }
   
 
  }
  async function getChannelInformation(){
   
    
    var res=await getChannelInf(account,channelDBInf.channelId,channelDBInf.network)
    setChannelInf(res)
  }

  return (
    <>
    {submitting=="uploadingToIpfs"&& (
          <Loading title="uploadingToIpfs"/>
          ) }
      {submitting=="saving"&& (
          <Loading title="saving"/>
          ) }
      {submitting=="approving"&& (
            <Loading title="approving"/>
          ) }
       {submitting=="joining"&& (
          <Loading title="Joining"/>
          ) }
      {submitting=="joiningout"&& (
          <Loading title="Joining out"/>
          ) }      
      {channelDBInf&&channelInf&&(
        <div className="relative flex flex-col   w-full mb-6" >
          <div
              className={"relative mt-1 w-full h-full bg-center bg-cover banner-h-"+channelInf.inf.appearance.bannerHeight}
              style={{backgroundColor:channelInf.inf.appearance.bannerColor}}>
            {channelInf.inf.appearance.coverImg_Url!=""&&(
            <img
              alt="..."
              src={`https://ipfs.io/ipfs/${channelInf.inf.appearance.coverImg_Url}`}
              className={"w-full align-middle  top-0 absolute  banner-h-"+channelInf.inf.appearance.bannerHeight}
            />
            )}
            {/* <span
                id="blackOverlay"
                className="w-full h-full absolute opacity-75 bg-black  top-0"
              ></span> */}
          </div>
          


          <div className="relative flex flex-col min-w-0 break-words   container mx-auto">
            <div className="flex-auto p-1">
              <div className="flex flex-wrap ">
                <div className="relative w-auto flex-initial rounded-full">
                  {channelInf.inf.appearance.iconImg_Url==""&&(
                    <span className="w-20 h-20 text-5xl  text-white inline-flex items-center justify-center rounded-full border-2 border-white  -mt-6"
                    style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
                      {"r/"+channelInf.name.substr(0,1)}({channelDBInf.network})
                    </span>
                  )}
                   
                 
                    {channelInf.inf.appearance.iconImg_Url!=""&&(
                       <span className="w-20 h-20 text-xl text-white inline-flex items-center justify-center rounded-full border-white  -mt-6"
                       >
                        <img src={`https://ipfs.io/ipfs/${channelInf.inf.appearance.iconImg_Url}`}
                        className="w-full w-20 h-20 rounded-full align-middle shadow-lg rounded-full border-2 border-blueGray-50 shadow " alt="..."/>
                      </span>
                    )}
                    {/* <img
                      className=
                        "text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 shadow-lg rounded-full red  -mt-6 mb-1"                    
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
                    /> */}
                    
                   
                </div>
                <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
                  <div className="flex flex-wrap ">
                    <div className="relative flex-initial pl-4  ">
                      <span className="font-semibold text-xl text-blueGray-700">
                      {channelInf.name}({channelDBInf.network})
                      </span>
                    </div>
                    <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
                    {/* <button className="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-700 hover:bg-lightBlue-600 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-6 py-1 mt-1 mb-1 rounded-full outline-none focus:outline-none mr-1 mb-1ease-linear transition-all duration-150" type="button">
                      Join
                    </button> */}
                    </div>
                  </div>
               
                  <h5 className="text-blueGray-400  font-bold text-xs pl-5 ">
                   {channelDBInf.did}
                  </h5>
                
                 
                </div>
                <div className="relative w-auto flex-initial rounded-full mt-3 mr-3">
                  <Link
                    className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs mt-2 px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    to={`/postcreate`}>
                
                    + Create new Post
                  </Link>
                  
                    
                   
                </div>
               
              </div>
              
            </div>
          </div>
          


        </div>
      )}



       <div className="px-4 md:px-10 mx-auto w-full  ">
          <div className="container mx-auto ">

            <div className="flex flex-wrap relative justify-center">
                {channelInf&&channelDBInf&&(
                  <ChannelPosts account={account}  active={active} chainId={chainId} currentUserProfile={currentUserProfile}
                  channelInf={channelInf} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
                  channelDBInf={channelDBInf} />)}


                {channelInf&&channelDBInf&&(<>
                  {(account==channelInf.creater)&&(
                    <div className="w-full lg:w-4/12 px-4">
                      <ChannelOwnerSideInf account={account}  active={active} chainId={chainId}
                      channelDBInf={channelDBInf } submitting={submitting}  setSubmitting={setSubmitting} channelInf={channelInf}
                      setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
                      />
                    </div>
                  )}
                  {(account!=channelInf.creater)&&(
                    <div className="w-full lg:w-4/12 px-4">
                      <ChannelUserSideInf account={account}  active={active} chainId={chainId}
                      channelDBInf={channelDBInf } submitting={submitting}  setSubmitting={setSubmitting} channelInf={channelInf}
                      setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>
                    </div>
                  )}
                </>)}
            </div>
          </div>
        </div>

      
    </>
  );
}
