import React, { useState,useEffect } from "react";
import ChannelAdminSidebar from "../../components/Channels/owner/ChannelAdminSidebar";

import PostedUsers from "../../components/Channels/owner/PostedUsers";
import JoinedUsers from "../../components/Channels/owner/JoinedUsers";
import Queues from "../../components/Channels/owner/Queues";
import Rule from "../../components/Channels/owner/Rules";
import Award from "../../components/Channels/owner/Awards";
import Setting from "../../components/Channels/owner/Setting";
import Appearance from "../../components/Channels/owner/Appearance";


import { useParams  } from 'react-router-dom';
import { Routes, Route,   } from "react-router-dom";


import {getChannelInf} from "../../Web3Api/Web3"
import  Loading from "../../components/Loading/loading";
import { backendPostRequest } from "../../axios/backendRequest";
export default function ChannelOwnerView({ account, setIsOpenSwitchNetworkModal, active,chainId}) {
 
  const { channeldid } = useParams();
  const[submitting, setSubmitting]=useState('ready')

  const [channelDBInf, setChannelDBInf]=useState(null)
  const [channelInf, setChannelInf]=useState(null)
  useEffect(()=>{  
    if(channeldid){     
      getChannelDBInformation()
    }
  },[ account,channeldid])
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
  
        
      <ChannelAdminSidebar  account={account} channelDBInf={channelDBInf}/>
      <div className="relative md:ml-64 ">  
        {/* <AdminNavbar />
        <HeaderStats /> */}
        {channelInf&&channelDBInf&&(
          <div className="px-4 md:px-10 mx-auto w-full pt-12 ">
            <Routes>
              <Route path="queues/:queuesort" exact element={ <Queues  account={account} active={active} chainId={chainId} channelDBInf={channelDBInf}  channelInf={channelInf} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} />
              
             
              {/* <Route path="queues/reports" exact element={ <ModQueue  account={account} currentUserInf={currentUserInf} active={active} channelId={channelId}/>} />
              <Route path="queues/spams" exact element={ <ModQueue  account={account} currentUserInf={currentUserInf} active={active} channelId={channelId}/>} /> */}
              
              <Route path="users/joined" exact element={ <JoinedUsers  account={account}  active={active} channelDBInf={channelDBInf} color="light"   channelInf={channelInf}/>} />
              <Route path="users/posted" exact element={ <PostedUsers  account={account} active={active} channelDBInf={channelDBInf}  channelInf={channelInf} color="light"/>} />
              
              <Route path="others/rules" exact element={ <Rule  account={account}  active={active} chainId={chainId} channelDBInf={channelDBInf}  channelInf={channelInf} setSubmitting={setSubmitting} 
                                                        setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} />
              <Route path="others/awards" exact element={ <Award  account={account}  active={active} channelDBInf={channelDBInf} channelInf={channelInf} color="light"/>} />
              {/* <Route path="others/wikis" exact element={ <Wiki  account={account} currentUserInf={currentUserInf} active={active} channelId={channelId} color="light"/>} />
             */}
            
              <Route path="setting" exact element={ <Setting  account={account} active={active}  chainId={chainId}  channelDBInf={channelDBInf} setSubmitting={setSubmitting} channelInf={channelInf}
                                                         setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} />
            
              <Route path="appearence" exact element={ <Appearance  account={account} active={active}  chainId={chainId} channelDBInf={channelDBInf}  setSubmitting={setSubmitting} channelInf={channelInf}
                                                           setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} />
              
            </Routes>
            {/* <FooterAdmin /> */}
          </div>
        )}
        
      </div>

      
    </>
  );
}
