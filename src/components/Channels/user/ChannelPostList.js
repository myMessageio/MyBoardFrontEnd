import React,{useState,useEffect} from "react";
import PostItem from "../../Posts/PostItem.js";
import SearchBox from "../../Posts/SearchBox.js";
import PostItemsSortMenu from "../../Posts/PostItemsSortMenu.js";
import { backendPostRequest } from "../../../axios/backendRequest.js";
export default function ChannelPostList({account, active,chainId,selNetworks,currentUserProfile,setIsOpenSwitchNetworkModal,channelDBInf}) {
  const [_posts, setPosts]=useState([]);
  const [sortType,setSortType]=useState("Hot") 
  const [searchtext,setSearchText]=useState("");
  useEffect(()=>{  
    getdata(true)
  },[sortType,selNetworks,channelDBInf])
  useEffect(()=>{  
  },[ _posts])  
  
  async function getdata( newselect,searchkey){   
    var offset=0;
   
    if(!newselect &&_posts.length>0){
      offset=_posts.length;
    }
    let formData = new FormData();    


    formData.append("channelnetwork", channelDBInf.network.toString());
    formData.append("channelcontract", channelDBInf.contractaddress.toString());
    formData.append("channelId", channelDBInf.channelId);

    formData.append("sortType", sortType);
    formData.append("creatorjoinstate","all")
    formData.append("offset", offset);

    if(searchkey||searchkey==''){   
      setSearchText(searchkey)
      formData.append("searchkey", searchkey);
    }else{   
      formData.append("searchkey", searchtext);
    }
    
    var res=await backendPostRequest("post/channelposts", formData);

    if(res.data.posts){

      if(newselect){
        setPosts(res.data.posts)
      }else{       
        var newPosts=_posts.concat(res.data.posts)           
        setPosts(newPosts)      
      }   
  
    }else{
      console.error("getpost error")
    }


  }
 
  
  function showMore(){
    getdata(false)    
  }


  return (
    <>
      <div className="w-full lg:w-8/12 px-4 mt-12">
    
        <SearchBox          
          currentUserProfile={currentUserProfile}
          account={account}          
          getdata={getdata}
        />
       
        <PostItemsSortMenu
           statPercentColor="text-emerald-500"  
           setSortType={setSortType} 
           sortType={sortType}
        />
        
        { _posts.map((_post)=>{        
          return(
         
              <PostItem
                key={"post"+_post.postId}
                chainId={chainId}
                postId={_post.postId} 
                active={active}
                statPercentColor="text-emerald-500"   
                account={account}                        
                transactionHash={_post.transactionHash}
                postedNetwork={_post.network}
                did={_post.did}
                setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
                postedChainId={_post.chainId}
                channeldid={_post.channeldid}
             
            />
          
           )

        })}   
      
        <div className="flex flex-wrap justify-center">
          <button className="text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
               onClick={showMore}
               >
            show more
          </button>
         
        </div>  
       
      </div>

     
            
      
    </>
  );
}
