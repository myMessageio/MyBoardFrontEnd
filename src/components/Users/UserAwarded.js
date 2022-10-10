import React, { useState,useEffect } from "react";
import PostCommentItem from "../Posts/PostCommentItem.js";

import PostItemsSortMenu from "../Posts/PostItemsSortMenu"
import { backendPostRequest } from "../../axios/backendRequest.js";
import { contractAddresses } from "../../Web3Api/env.js";
import SearchBox from "../Posts/SearchBox";
export default function  UserAwarded({seluser, 
  active ,account,chainId,setIsOpenSwitchNetworkModal,selNetworks
  }) { 
  const [sortType,setSortType]=useState("Hot") 
  const [_posts, setPosts]=useState([]);
  const [searchtext,setSearchText]=useState("");
  
    useEffect(()=>{
    
      if(seluser){
        getdata(true)   
      }
  
    },[active,sortType,account,seluser,selNetworks])
  async function getdata(newselect,searchkey){ 
    var skip=0;   
    if(!newselect &&_posts.length>0){
       skip=_posts.length;
    }  

    let formData = new FormData();  
    var selnetworkNames=[]
    var selcontractaddresses=[]
    for (let key in selNetworks) {
      if(selNetworks[key]){
        selnetworkNames.push(key);
        selcontractaddresses.push(contractAddresses[key]['myboard'])
      }
    }  

  
    if(selnetworkNames.length==0){
      setPosts([])
      return  
    }
     

    
    var selnetworksstr=selnetworkNames.toString()
    var selcontractaddrstr=selcontractaddresses.toString()
    console.log(skip)

    formData.append("selnetworksstr", selnetworksstr);
    formData.append("selcontractaddrstr", selcontractaddrstr);
    formData.append("account", seluser);    
    formData.append("offset", skip);    
    formData.append("sortType", sortType);  
    if(searchkey||searchkey==''){   
      setSearchText(searchkey)
      formData.append("searchkey", searchkey);
    }else{   
      formData.append("searchkey", searchtext);
    } 
    var res=await backendPostRequest("user/awardedposts", formData);
    console.log(res.data);
    if(res.status==200){     
      if(res.data.posts){
        if(newselect){
          setPosts(res.data.posts)
        }else{       
          var newPosts=_posts.concat(res.data.posts)           
          setPosts(newPosts)      
        }   
      }
     }

  }


  // useEffect(()=>{   
  //     if(active)
  //     getTotalPostsCount(postListFetch,setTotalPostCount,setPostsIdsSelected)
        
  // },[ active])  
  
  function showMore(){
    getdata(false)    
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full"> 
          <SearchBox
            account={account}          
            getdata={getdata}
              />  
          <PostItemsSortMenu
            statPercentColor="text-emerald-500"  
            setSortType={setSortType} 
            sortType={sortType}
          />
 
          {_posts.map((post,i)=>{
              return(
                <PostCommentItem
                      key={"postcommentitem"+i}
                      postDBData={post}
                      active={active}
                      chainId={chainId}
                      statPercentColor="text-emerald-500"   
                      account={account}
                      selaccount={seluser}
                      showtype={"awarded"}
                      setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
                      searchkey={searchtext}
                    />)
            })} 
         
          <div className="flex flex-wrap justify-center">
            <button className="text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                onClick={showMore}
                >
              show more
            </button>
          
          </div>
        
        </div>

      </div>
      
     
    </>
  );
}
