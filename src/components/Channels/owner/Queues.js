
import React,{useState,useEffect} from "react";
import PostItem from "../../Posts/PostItem";
// components

import { useParams  } from 'react-router-dom';

import PostItemsSortMenu from "../../Posts/PostItemsSortMenu";
import { backendPostRequest } from "../../../axios/backendRequest";
import SearchBox from "../../Posts/SearchBox";
export default function PostList({account, chainId,active,channelInf,channelDBInf,setIsOpenSwitchNetworkModal}) {
  const { queuesort } = useParams();

  const [_posts, setPosts]=useState([]);
  const [sortType,setSortType]=useState("Hot") 
  const [searchtext,setSearchText]=useState("");

  useEffect(()=>{
   
      //getTotalPostsCount(postListFetch,setTotalPostCount)
    
       
        getdata(true)
     
 
      //getTotalPostCount()
   
  },[ sortType,queuesort])

//notContainedIn

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
    formData.append("offset", offset);
    if(queuesort=="modqueues"){
      formData.append("creatorjoinstate","joined")
      
     
    }else if(queuesort=="unmoderated"){
      formData.append("creatorjoinstate","unjoined")
    }else{
      formData.append("creatorjoinstate","all")
    }

    if(searchkey||searchkey==''){   
      setSearchText(searchkey)
      formData.append("searchkey", searchkey);
    }else{   
      formData.append("searchkey", searchtext);
    }
    
    var res=await backendPostRequest("post/channelposts", formData);
    console.log(res)
   
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


 
  function showMore(){
    getdata(false)    
  }

  
  return (
    <>
      <div
        className=
          "relative flex flex-col min-w-0 break-words w-full mb-6  rounded "
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 bg-green-600 mb-2 shadow-lg ">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              
              <h3  className= "font-semibold text-lg text-white" >
                {queuesort=="modqueues"&&(<> Mod Queues</>)}
                {queuesort=="unmoderated"&&(<> Unmoderated Queues</>)}
                {queuesort=="allqueues"&&(<> All Queues</>)}
               
              </h3>
            </div>
          </div>
        </div>
        <SearchBox
          account={account}          
          getdata={getdata}
              />

        <PostItemsSortMenu
           statPercentColor="text-emerald-500"  
           setSortType={setSortType} 
           sortType={sortType}
        />
        {/* <div className="block w-full overflow-x-auto">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-blueGray-100 border-0">
            
            <div className="flex-auto  bg-white rounded-lg">
           
              <div className="flex flex-wrap ">       
                <div className="relative w-auto  flex-initial bg-slate-200 p-2 ">        
                  <div className="text-center  text-2xl flex w-auto justify-center pt-3 ">
                    <input
                              id="customCheckLogin"
                              type="checkbox"
                              className="form-checkbox border-0 rounded text-blueGray-700  w-5 h-5 ease-linear transition-all duration-150"
                            />
                  </div>               
                </div>
                <div className="relative w-full pl-4 pr-4 max-w-full flex-grow flex-1">
        
                  <div className="flex flex-wrap mt-5 mb-5">                
                  
                  <span className={ " mr-2"}>
                    
                      <i className="far   fa-comment-alt"></i>{" comment"} 
                  </span>
                
                    <button className={ " mr-2"}>
                      
                        <i className="fas   fa-gift"></i>award
                    </button>
               
                    <span className={ " mr-2"} >
                      
                        <i className="fas   fa-gift"></i> Your Awards 
                    </span>
                  </div>
                </div>
                
    
                
              </div>          
              
            </div>
          </div>
        </div> */}
        <div className="block w-full overflow-x-auto">
          { _posts.map((_post,i)=>{  
          
            return(
              <PostItem
              key={"post-"+i}
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
           
          />)

          })} 
          
        </div>
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

