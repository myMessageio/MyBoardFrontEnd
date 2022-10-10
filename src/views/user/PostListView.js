import React,{useEffect} from "react";
import PostList from "../../components/Posts/PostList.js";
import HomeSidePanel from "../../components/Posts/HomeSidePanel.js";
export default function PostListView({account,active,chainId,selNetworks,currentUserProfile,setIsOpenSwitchNetworkModal}) {
  useEffect(()=>{},
  [
    account,active,chainId,selNetworks
  ])

  return (
    <>
       <div className="px-4 md:px-10 mx-auto w-full  ">
          <div className="container mx-auto ">
            <div className="flex flex-wrap relative justify-center">            
                <PostList account={account}  active={active} chainId={chainId} selNetworks={selNetworks} currentUserProfile={currentUserProfile} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>
                
                <div className="w-full lg:w-4/12 px-4">
                  <HomeSidePanel account={account}  active={active} chainId={chainId} selNetworks={selNetworks} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>
                </div>
              
            </div>
          </div>
        </div>

      
    </>
  );
}
