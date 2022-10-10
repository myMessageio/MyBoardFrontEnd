import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import  Loading from "../Loading/loading";
import Moment from 'react-moment';
import UserCommentItem from "./UserCommentItem"
import { SuccessToast,ErrorToast } from "../toast/toast";

import {
    getWriteContract,
  getPostInf,
  postVoteUpSet,
  postVoteDownSet,
  pollItemVote,
  awardToPost,
  MesaTokenApprove,
  getMESAAAllowanceOfUser,
  getMESABalanceOfUser  
 } from "../../Web3Api/Web3"

import { backendPostRequest } from "../../axios/backendRequest";
import { awardTokenAmount,chainScanUrls } from "../../Web3Api/env";
export default function PostCommentItem({
  statPercentColor,  
  active,
  account,
  postDBData,
  selaccount,
  showtype,
  chainId,
  setIsOpenSwitchNetworkModal,
  searchkey 
  
}) {

  const [[postDetailInf,postOtherInf,pollVoteInf],setPostInf]=useState([null,null,null])
 

  const [submitting,setSubmitting]=useState("ready")
  const[comments,setComments]=useState([])

  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")
  const MesaTokenContract=getWriteContract(chainId,account,active,"mesa")
  const [copyItemName,setCopyItemName]=useState('')
  // moralis hook

  ////
  useEffect(()=>{  
      getPostDataInf();
  },[active,account,chainId,postDBData])  
  
  useEffect(()=>{

    if(postDetailInf && showtype!="posts"){    
      getSubcomments()     
    }

  },[postDetailInf])
  useEffect(()=>{},[comments,copyItemName])
  

  /////get function
  
  async function getSubcomments(){
        
    let formData = new FormData();  
    
    formData.append("postdid", postDBData.did); 
    formData.append("searchkey", searchkey);
    formData.append("account", selaccount); 
    var url="";
    if(showtype=="overview" || showtype=="comments") {
      url="user/postcomments"
    } else if( showtype=="upvoted"){
      url="user/upvotedcomments"
    } else if(showtype=="downvoted"){
      url="user/downvotedcomments"
    }else if(showtype=="awarded"){
      url="user/awardedcomments"
    }
    var res=await backendPostRequest(url, formData); 
    if(res.status==200){     
      if(res.data.comments){
        setComments(res.data.comments)        
      }
     }
     
  }
  async function getPostDataInf(){
    const [postdetail,postother,postpollvote] =await getPostInf(account,postDBData.postId,"no",postDBData.network);
    setPostInf([postdetail,postother,postpollvote])   
  }



  async function awardToThisPost(){
   
   
    if(!account||!active||postDBData.chainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postDBData.chainId.toString()]);
      return
    }
    var balance = await getMESABalanceOfUser(account,postDBData.network)
    var allowanceAmount = await getMESAAAllowanceOfUser(account,postDBData.network)  
    if(awardTokenAmount>Number(balance)/Math.pow(10,18)){     
      ErrorToast("You don't have enought MESA Tokens in your wallet")  
      setSubmitting("ready")
      return;
    }
  
    if(awardTokenAmount>Number(allowanceAmount)/Math.pow(10,18)){      
      setSubmitting("approving")
      var res=await MesaTokenApprove(chainId,MesaTokenContract,account,awardTokenAmount)
      if( res=="success"){
        SuccessToast("Approved successfully")
        
      }else{
        ErrorToast("failed in approving")  
        setSubmitting("ready")
        return;    
      }
    }
   
    setSubmitting("awarding")
    var res2=await awardToPost(chainId,MyBoardContract,account,postDBData.postId)  
      if( res2=="success"){
        SuccessToast("Awarded successfully")
        getPostDataInf()
        setSubmitting("ready")

      }else{
        ErrorToast("failed in awarding")       
      }
    setSubmitting("ready")
}


  async function postUpVote(){
   
    if(!account||!active||postDBData.chainId!=chainId){
    
      setIsOpenSwitchNetworkModal([true,true,postDBData.chainId.toString()]);
      return
    }   
    setSubmitting("voting")
    var res=  await postVoteUpSet(chainId,MyBoardContract,account,postDBData.postId)
    if(res=="success"){
      SuccessToast("voted successfully")
      getPostDataInf()
    }else{
      ErrorToast("failed in voting")
    }
    setSubmitting("ready")
  }
  async function postDownVote(){
    if(!account||!active||postDBData.chainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postDBData.chainId.toString()]);
      return
    }  
   
    setSubmitting("voting")
    var res= await postVoteDownSet(chainId,MyBoardContract,account,postDBData.postId)
    if(res=="success"){
      SuccessToast("voted successfully")
      getPostDataInf()
    }else{
      ErrorToast("failed in voting")
    }
    setSubmitting("ready")
 
  }
  async function postPollVote(index){
    if(!account||!active||postDBData.chainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postDBData.chainId.toString()]);
      return
    }
    setSubmitting("pollvoting")
    var res=  await pollItemVote(chainId,MyBoardContract,account,postDBData.postId,index)
    if(res=="success"){
      SuccessToast("voted successfully")
      getPostDataInf()
    }else{
      ErrorToast("failed in pollvoting")
    }
    setSubmitting("ready")
    

  }

  return (
    <>
      {submitting=="voting"&& (
        <Loading title="voting"/>
        ) }
        {submitting=="pollvoting"&& (
        <Loading title="pollvoting"/>
        ) }
          {submitting=="awarding"&& (
        <Loading title="awarding"/>
        ) }
        {submitting=="approving"&& (
        <Loading title="approving"/>
        ) }

      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-blueGray-100 border-0">
         
        <div className="flex-auto  bg-white rounded-lg">       
          {postDetailInf&&postOtherInf&&(
            <div className="flex flex-wrap border-b">  
              
                <div className="relative w-auto  flex-initial  p-2">        
          
                  <a key={`post${postDBData.postId}-up`} onClick={()=>{postUpVote()}}>
                    <i className= {
                      "fas fa-arrow-up text-2xl leading-lg" +
                      (postOtherInf.voteState==1 ? " text-emerald-500" : " text-blueGray-400")
                    }                    
                    />
                  </a>
                  <div className="text-center  text-2xl flex w-auto justify-center ">
                    <label>  {postDetailInf.upvotes-postDetailInf.downvotes}</label>            
                  </div> 
                  <a  key={`post${postDBData.postId}-down`} onClick={()=>{postDownVote()
                    }}>
                    <i className={
                      "fas fa-arrow-down text-2xl leading-lg" +
                      (postOtherInf.voteState==2 ? " text-emerald-500" : " text-blueGray-400")
                    } />
                  </a>
                </div>
                 
                
                
              <div className="relative w-full pl-4 pr-4 max-w-full flex-grow flex-1">
                <div className="text-center flex justify-between mt-4">
                        
                    <h5 className="text-blueGray-400  font-bold text-xs">
                      {postDetailInf.postType==0&&(
                          <span className="text-lightBlue-500 background-transparent font-bold uppercase  text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            Public
                          </span>
                          )

                        }
                        {postDetailInf.postType==1&&(
                          <span className="text-amber-500 background-transparent font-bold uppercase  text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                            Private
                          </span>
                          )

                        }
                        {postDetailInf.postType==2&&(
                            <span className="text-indigo-500 background-transparent font-bold uppercase text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                              Paid 
                            </span>
                            )

                        }
                      <span className={ "text-black mr-1"}> posted by</span>
                      <Link to={`/user/${postDetailInf.creator}`}>
                        {postDetailInf.creator.substring(0,6)+"..."+postDetailInf.creator.substring(38)}
                      </Link>
                      {" "}
                      <button onClick={()=>{navigator.clipboard.writeText(postDetailInf.creator);
                            setCopyItemName("creator")}}><i className={copyItemName!="creator"?("far fa-copy"):("fas fa-copy")}></i></button>
              
                      <span className={statPercentColor + " mr-1"}> in</span> 
                      <Link to={`/channel/${postDBData.channeldid}/posts`}>
                        {postOtherInf.channelName}
                      </Link>
                      <span className={statPercentColor + " mr-1 ml-1"}> 
                      <Moment fromNow>{postDetailInf.created_at}</Moment></span> 
                        &nbsp; 
                    
                    </h5>   
                    <h4 className="text-blueGray-400  font-bold text-xs">
                      <a href={`${chainScanUrls[postDBData.network]}/tx/${postDBData.transactionHash}`} target="_blank" >
                      {"TX_ID:"+postDBData.transactionHash.substring(0, 6)+"..."+postDBData.transactionHash.substring(60)}({postDBData.network})
                      </a>
                      {" "}
                      <button onClick={()=>{navigator.clipboard.writeText(postDBData.transactionHash);
                            setCopyItemName("transactionHash")}}><i className={copyItemName!="transactionHash"?("far fa-copy"):("fas fa-copy")}></i></button>
              
                    </h4>
                  
                
                </div>
                <Link 
                      to={`/postdetail/${postDBData.did}`}>
                  <h3 className="text-3xl mb-2 font-semibold leading-normal">
                    {postDetailInf.title}
                  </h3>
                </Link>
              
                {postDetailInf.creator.toLowerCase()==selaccount.toLowerCase()&&(
                  <>
                    {postDetailInf.content&&(
                      <>
                        {(postDetailInf.postSort==0||postDetailInf.postSort==3)&&(
                            <div className="ql-editor" 
                            style={{height:"auto",padding: "0px"}}>
                              <div dangerouslySetInnerHTML={{__html: postDetailInf.content.data}}></div>
                            </div>
                        )}           
                        {(postDetailInf.postSort==1)&&(
                          <div className="flex flex-wrap justify-center">
                            <div className="w-6/12 sm:w-4/12 px-4">
                              <img  src={`https://ipfs.io/ipfs/${postDetailInf.content.imageUrl}`}   />
                            </div>
                          </div>
                        )}
                        {(postDetailInf.postSort==2)&&(
                          <div className="flex flex-wrap ">
                          
                              <a href={postDetailInf.content.data}>
                            {postDetailInf.content.linkUrl}
                            </a>
                            
                          </div>
                        )}
                        {(postDetailInf.postSort==3)&&(
                          <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
                              <h3 className="text-xl font-semibold leading-normal">
                                Votes
                              </h3>
                              
                              {postDetailInf.content.pollItems.map((pollItem,i)=>{                                          
                                if((i+1)==pollVoteInf.userVotedPollId)
                                {
                                  return(
                                    <div  key={`post${postDBData.postId}-pollitem${i}`} className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white ">
                                          <div className=" flex flex-row justify-start">
                                            <div className=" px-1 ">
                                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-teal-600 bg-teal-200 uppercase last:mr-0 mr-1">
                                                votes:{pollVoteInf.votes[i]}
                                              </span>
                                            </div>
                                            <div className=" px-1 ">
                                                <label className=" text-pink-500 border  font-bold uppercase text-xs px-1 py-1  ease-linear transition-all duration-150" 
                                                    onClick={()=>{postPollVote(i+1)}}>
                                                  voted
                                                </label>
                                              </div>
                                              
                                        </div>
                                      <div className=" flex flex-col justify-start px-1">   
                                                                  
                                        <p className="  break-all text-blue-500 background-transparent font-bold uppercase py-1 px-2  text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" >
                                        
                                          {pollItem}
                                        </p>
                                        
                                      </div>
                                    </div>)

                              
                                }
                                else{
                                    return(                       

                                      <div  key={`post${postDBData.postId}-pollitem${i}`} className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white ">
                                          <div className=" flex flex-row justify-start">
                                              <div className=" px-1 ">
                                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-teal-600 bg-teal-200 uppercase last:mr-0 mr-1">
                                                  votes:{pollVoteInf.votes[i]}
                                                </span>
                                              </div>
                                              {pollVoteInf.userVotedPollId==0&&(
                                                  <div className=" px-1 ">
                                                    <button className="text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase text-xs px-1 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150" type="button"
                                                        onClick={()=>{postPollVote(i+1)}}>
                                                      vote
                                                    </button>
                                                  </div>
                                                  )
                                                }  
                                          </div>
                                        <div className=" flex flex-col justify-start px-1">   
                                                                    
                                          <p className="text-gray-700 text-base mb-4 break-all" >
                                          
                                            {pollItem}
                                          </p>
                                        
                                        </div>
                                      </div>
                                      
                                      // <div  key={`post${postDBData.postId}-pollitem${i}`}>
                                      //   <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-teal-600 bg-teal-200 uppercase last:mr-0 mr-1">
                                      //   {pollVoteInf.votes[i]+" votes"}
                                      //   </span>

                                      //   {pollVoteInf.userVotedPollId==0&&(
                                      //     <button className="text-pink-500 border border-pink-500 hover:bg-pink-500 hover:text-white active:bg-pink-600 font-bold uppercase text-xs px-1 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150" type="button"
                                      //         onClick={()=>{pollItemVote(web3fetch,postId,i+1,setSubmtting, getPostDataInf)}}>
                                      //       vote
                                      //     </button>)}
                                      //   <label className="text-sm font-semibold  py-1 px-2  ">
                                      //  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                      //  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                                      //   </label>
                                      // </div>
                                      )
                                  }
                              })}
                          </div>
                          )}
                          
                      </>
                    )}
                  </>
                )}
                {postDetailInf.creator.toLowerCase()!=selaccount.toLowerCase()&&(
                  <div className="flex flex-wrap ">
                          
                    <p href={postDetailInf.content.data}>
                      this user commented on this post
                    </p>
                    
                  </div>
                   
                )}
                <div className="flex flex-wrap mt-3 mb-2">                
                        
                  <span className={statPercentColor + " mr-2"}>
                    
                      <i className="far   fa-comment-alt"></i>{" comment"}  {postDetailInf.commentcount}
                  </span>
                  {(account&&active)?(
                    <>
                      <button className={statPercentColor + " mr-2"} onClick={awardToThisPost}>
                        <i className="fas   fa-gift"></i>award  {postDetailInf.awardCount}
                     
                      </button>  {postOtherInf.userAwards>0&&(<>(Yours {postOtherInf.userAwards})</>)}

                      
                    </>
                  ):(<>
                    <button className={statPercentColor + " mr-2"} onClick={awardToThisPost}>
                          
                          <i className="fas   fa-gift"></i>award {postDetailInf.awardCount}
                      </button>
                  </>)}
                  
                  <Link 
                      to={`/postdetail/${postDBData.did}`}>
                  <span className={statPercentColor + " mr-2"}>
                      <i className="fas fa-share"></i>{" "}reply
                  
                  </span>
                  </Link>
                
                  {"   "}
                  {/* <span className={statPercentColor + " mr-2"}>
                    <i className="fas fa-bookmark"></i>{" "}save 
                    </span>  */}


                </div>
              </div>               
            </div>
            )}
          {showtype!="post"&&postDetailInf&&(
            <div className="flex flex-wrap pl-4 pr-4">
              <div className="w-full lg:w-12/12 cus_timeline">
                <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
                  {comments.map((comment,i)=>{                                  
                    return(
                    <UserCommentItem
                      key={`comment-${i}`}
                      commendDBData={comment}                    
                      privatekey="no"
                      statPercentColor="text-emerald-500" 
                      account={account}
                      active={active}                                         
                      selaccount={selaccount}
                      chainId={chainId}                      
                      showtype={showtype}
                      />)

                  })}
                </ol>
              </div>
            </div>
          )}
          
        </div>
       
      </div>
     
    </>
  );
}

