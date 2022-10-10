import React, { useState,useEffect } from "react";
import PostCommentItem from "../Posts/PostCommentItem.js";
// components

import PostItemsSortMenu from "../Posts/PostItemsSortMenu"
import { backendPostRequest } from "../../axios/backendRequest.js";

import { contractAddresses } from "../../Web3Api/env";
import SearchBox from "../Posts/SearchBox";
export default function  UserOverView({seluser, 
  active ,account,chainId,setIsOpenSwitchNetworkModal,selNetworks
  }) {
 
  const [sortType,setSortType]=useState("Hot") 
  const [_posts, setPosts]=useState([]);
    //getDataFromCloudFunction
    const [searchtext,setSearchText]=useState("");
    useEffect(()=>{
    
      if(seluser){
        getdata(true)   
      }
  
    },[active,sortType,account,seluser,selNetworks])
    useEffect(()=>{},[_posts])
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
    var res=await backendPostRequest("user/overviewposts", formData);

    if(res.status==200){     
      if(res.data.posts){
        if(newselect){         
          var newPosts=res.data.posts           
          setPosts(newPosts)
        }else{       
          var newPosts=_posts.concat(res.data.posts)           
          setPosts(newPosts)      
        }   
      }
     }

  }
 
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
                      showtype={"overview"}
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
