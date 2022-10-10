import React from "react";

import TopicMenu from "../../components/Channels/List/TopicMenu"
import ChannelList from "../../components/Channels/List/ChannelList"

import { useParams  } from 'react-router-dom';

export default function ChannelListView({ account, active,chainId,selNetworks,setIsOpenSwitchNetworkModal}) {
 
  const { topic } = useParams();



  
  return (
    <>
      
      <div className="px-4 md:px-10 mx-auto w-full  ">
        <div className="container mx-auto ">
          <div className="flex flex-wrap relative justify-center">  
            <div className="w-full lg:w-3/12 md:w-3/12 px-4 ">
              <TopicMenu  topic={topic} />
            </div>    
            <div className="w-full lg:w-8/12 md:w-6/12  px-4">
              <ChannelList  account={account}  active={active} chainId={chainId} selNetworks={selNetworks}
                            setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal} topic={topic}/>
            </div>        
            
            {/* <div className="w-full lg:w-3/12  md:w-3/12 px-4">
              <LeftSideBar  account={account} currentUserInf={currentUserInf} active={active} topic={topic}/>
            </div> */}
          
          </div>
        </div>
      </div>
  
        
      
      

      
    </>
  );
}
