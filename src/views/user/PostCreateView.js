import React from "react";

// components
import { useParams,useSearchParams  } from 'react-router-dom';
import PostCreate from "../../components/Posts/PostCreate.js";

export default function PostCreateView({account, currentUserProfile,active,chainId,setIsOpenSwitchNetworkModal}) {

  let [searchParams]=useSearchParams();

  return (
    <>
      <div className="px-4 md:px-10 mx-auto w-full py-4 ">
        <div className="container mx-auto">

          <div className="flex flex-wrap justify-center">
          
            <div className="w-full lg:w-8/12 px-4 mt-4">              
              <PostCreate
                // postTypeTitle={postType}   
                // postType={postTypes[postType]}
                account={account}
                active={active}
                chainId={chainId}
                currentUserProfile={currentUserProfile}
      
                setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
             

              />
            </div>
            
          </div>
        </div>
      </div>

      
    </>
  );
}
