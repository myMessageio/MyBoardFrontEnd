import React,{useState,useEffect} from "react";
import PostItem from "../../Posts/PostItem.js";
import PostCreateSelectItem from "../../Posts/PostCreateSelectItem";
import PostItemsSortMenu from "../../Posts/PostItemsSortMenu";

import { faTurnUp } from "@fortawesome/free-solid-svg-icons";

export default function PostList({account, currentUserInf,isWeb3Enabled,channelId}) {

  // const [postlist, setpostlist]=useState([]);

  const { data:postListData, error:postListError, fetch:web3fetch, isFetching:postListFetching, isLoading:postListLoading } = useWeb3ExecuteFunction();/////web3 signup hook data

  const [channelInf,setChannelInf]=useState(0);
  const [channelPostsIdsSelected,setChannelPostsIdsSelected]=useState(false)
  const [_postIds, setPostIds]=useState([]);
  const [showPageCount, setshowPageCount]=useState(1)

  useEffect(()=>{
    
      //getTotalPostsCount(postListFetch,setTotalPostCount)
      if(isWeb3Enabled &&channelId>0){      
        getChannelInf(web3fetch,channelId,setChannelInf)
      }
 
      //getTotalPostCount()
   
  },[ isWeb3Enabled])

  useEffect(()=>{ 
    if(!channelPostsIdsSelected&&channelInf){
      initialShowIDs()

    }
  },[channelInf,channelPostsIdsSelected])
  async function initialShowIDs(){
    var pagepercount=10;
    var ids=[];
    var postcount=channelInf.postCount.toNumber();
    console.log(postcount)   
    for(var i=postcount;(i>postcount-pagepercount)&&(i>0);i--){
      var postid= await getPostIdOfChannelByNo(web3fetch,channelId,i)
      
      if(postid){     
        ids.push(postid)
      }
    }
   
    setChannelPostsIdsSelected(true)
     
    setPostIds(ids)
  }
  
  async function showMore(){
    var pagepercount=10;
    var postcount=channelInf.postCount.toNumber()
    if(postcount/ pagepercount>showPageCount){
     
      var ids=[]
      for(var i=postcount;(i>postcount-pagepercount*(showPageCount+1))&&(i>0);i--){
        var postid= await getPostIdOfChannelByNo(web3fetch,channelId,i)
        ids.push(postid)
      }   
      setPostIds(ids)
      setshowPageCount( showPageCount+1)
    }
  }


 
  function handleScroll(e){
    console.log(e.target.scrollHeight,e.target.scrollTop)

  }
  

  return (
    <>
      <div className="w-full lg:w-8/12 px-4 mt-12" onScroll={handleScroll}>
        {currentUserInf ?(
          <PostCreateSelectItem
            statPercentColor="text-emerald-500"
            currentUserInf={currentUserInf}
            account={account}   
          />
        ):(<></>)}
        <PostItemsSortMenu
           statPercentColor="text-emerald-500"   
        />
       
        { _postIds.map((i)=>{   
          return(
              <PostItem
              key={i}
              postId={i}
              isWeb3Enabled={isWeb3Enabled}
              statPercentColor="text-emerald-500"   
              account={account}
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
      {/* <div className="flex flex-wrap justify-center">s
                  <div className="w-6/12 sm:w-4/12 px-4"> */}
     
            
      
    </>
  );
}
