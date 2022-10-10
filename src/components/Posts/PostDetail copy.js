import React, { useEffect, useState }  from "react";
import { Link } from "react-router-dom";
//////component
import CommentItem from "../Comments/CommentItem.js"
import Loading from "../../components/Loading/loading" ;
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import {SuccessToast,ErrorToast} from "../toast/toast"
import Moment from 'react-moment'; 

import {mainDataEncryptUploadToIpfs
  } from "../../ipfs/ipfs"

  import {     
    createComment,
    postVoteUpSet,
    postVoteDownSet,
    pollItemVote,

    awardToPost,
    MesaTokenApprove,

    getWriteContract,
    getMESAAAllowanceOfUser,
    getMESABalanceOfUser  
    
    

   } from "../../Web3Api/Web3"
import { backendPostRequest } from "../../axios/backendRequest.js";
import {   awardTokenAmount,chainScanUrls } from "../../Web3Api/env";
export default function PostDetail({ 
  account,
  postDetailInf,
  postOtherInf,
  pollVoteInf,
  
  postId,
  active ,

  statPercentColor,
  privateKey,
  getPostDataInf,
  chainId,
  transactionHash,
  setIsOpenSwitchNetworkModal,
  postedChainId,
  postedNetwork,
  postedContractAddress,
  postedchannelId,
  channeldid

 
}) {

  

   // moralis hook

  /////ipfs

  /////////coomment variable
  ///createcommentstate
  const [commentDescription, setCommentDescription] = useState(""); 
  ///loadingstate
  const[submitting, setSubmitting]=useState('ready')
  const[comments, setComments]=useState([]);


  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")
  const MesaTokenContract=getWriteContract(chainId,account,active,"mesa")
  ////get information
  useEffect(()=>{
     if(postId>0){ 
      getComments()
    
     }
   
   },[ postId])  




 ////////posting function
  
    ////write a comment
  async function commentSubmitting(contentUrl,encryptkey){
 
  
    if(!contentUrl){      
      ErrorToast("Error occurs in IPFS Uploading")
      setSubmitting("ready");
      return;
    }
    var _privatekey="no"
    if(postDetailInf.postType==1){
      _privatekey=privateKey
    }
    setSubmitting("submitting")
    var res = await createComment(chainId,MyBoardContract,account,postId,contentUrl,0,_privatekey,encryptkey)
    if(res=="success"){
      SuccessToast("New comment was created successfully!")
      setSubmitting("ready")
      getComments()
      setCommentDescription('')
    }else{
      ErrorToast("New comment Creating failed")
      setSubmitting("ready")
    }
  
  
   
  }

  async function onWriteButtonClick(e,_parentCommnetid){
    e.preventDefault();
    if(commentDescription==""||commentDescription=="<p><br></p>"||commentDescription=="<p></p>"){
      ErrorToast("You must select an descripton");
      return;
    }
    setSubmitting("uploadingToIpfs")
    mainDataEncryptUploadToIpfs(JSON.stringify(commentDescription),commentSubmitting)
 
  }

  ///////getcommentids
 async function getComments(){
    let formData = new FormData();
    formData.append("network", postedNetwork);
    formData.append("contractaddress",postedContractAddress)
    formData.append("postId",postId)    
    formData.append("parentId",0)  
    formData.append("channelId",postedchannelId)
    var res=await backendPostRequest("comment/getsubcomments", formData);
   
    if(res.data.result=="success"){
     
      setComments(res.data.comments);
    }

   
  }
  //////comment list

  async function awardToThisPost(){
    if(!account||!active||postedChainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()]);
      return
    }
 
    var balance = await getMESABalanceOfUser(account,postedNetwork)
    var allowanceAmount = await getMESAAAllowanceOfUser(account,postedNetwork)  
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
    var res2=await awardToPost(chainId,MyBoardContract,account,postId)  
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
    if(!account||!active||postedChainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()]);
      return
   
    }
    setSubmitting("voting")
    var res=await postVoteUpSet(chainId,MyBoardContract,account,postId)
    if(res=="success"){
      SuccessToast("voted successfully")
      getPostDataInf()
    }else{
      ErrorToast("failed in voting")
    }
    setSubmitting("ready")

  }
  async function postDownVote(){
    if(!account||!active||postedChainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()]);
      return
   
    }
   
      setSubmitting("voting")
      var res=await postVoteDownSet(chainId,MyBoardContract,account,postId)
      if(res=="success"){
        SuccessToast("voted successfully")
        getPostDataInf()
      }else{
        ErrorToast("failed in voting")
      }
      setSubmitting("ready")
   
  }
  async function postPollVote(index){ 
    if(!account||!active||postedChainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()]);
      return
 
    }
    setSubmitting("pollvoting")
    var res=await  pollItemVote(chainId,MyBoardContract,account,postId,index)
    if(res=="success"){
      SuccessToast("voted successfully")
      getPostDataInf()
    }else{
      ErrorToast("failed in voting")
    }
    setSubmitting("ready")

  }
  ///////////////////////////
 

  const  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', ],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      [ 'image'],
      ['clean'],
    
    ],
  }




    return (
      
      <>
        {submitting=="submitting"&& (
          <Loading title="Submitting"/>
          ) }
        {submitting=="voting"&& (
          <Loading title="voting"/>
          ) }
        {submitting=="pollvoting"&& (
          <Loading title="pollvoting"/>
          ) }
        {submitting=="uploadingToIpfs"&& (
          <Loading title="uploading To Ipfs"/>
          ) }
        {submitting=="approving"&& (
          <Loading title="approving"/>
          ) }
        {submitting=="awarding"&& (
          <Loading title="awarding"/>
          ) }
        <div className="w-full lg:w-8/12 px-4 mt-12">
          <div className="relative flex flex-col min-w-0 break-words bg-white rounded xl:mb-0 shadow-lg">
            <div className="flex-auto p-4">
              <div className="flex flex-wrap">
                {/* ----------------post information */}
                <div className="relative w-auto  flex-initial ">        
          
                  <a onClick={()=>{postUpVote()}}>
                    <i className= {
                      "fas fa-arrow-up text-2xl leading-lg" +
                      (postOtherInf.voteState==1 ? " text-emerald-500" : " text-blueGray-400")
                    }
                  
                    />
                  </a>
                  <div className="text-center  text-2xl flex w-auto justify-center ">
                    <label>  {postDetailInf.upvotes-postDetailInf.downvotes}</label>
                
                  </div>
                  <a onClick={()=>{postDownVote()}}>
                    <i className={
                      "fas fa-arrow-down text-2xl leading-lg" +
                      (postOtherInf.voteState==2 ? " text-emerald-500" : " text-blueGray-400")
                    } />
                  </a>
                </div>
                <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
                  <div className="text-center flex justify-between mt-4">
                  {postDetailInf&&(
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
                      <span className={statPercentColor + " mr-2"}> posted by</span>
                      <Link to={`/user/${postDetailInf.creator}/overview`}>
                      {postDetailInf.creator.substring(0,6)+"..."+postDetailInf.creator.substring(38)}
                      </Link>
                    
                      <span className={statPercentColor + " mr-2"}> in</span> 
                      <Link to={`/channel/${channeldid}/posts`}>
                        {postOtherInf.channelName}
                      </Link>
                      <span className={statPercentColor + " mr-2"}>  <Moment fromNow>{postDetailInf.created_at}</Moment></span> 
                     
                      <span className={statPercentColor + " mr-2"}> {postDetailInf.awardCount} awards</span> 
                      
                        
                    </h5>)}
                    
                                    
                    <h4 className="text-blueGray-400  font-bold text-xs">
                      <a href={`${chainScanUrls[postedNetwork]}/tx/${transactionHash}`}  target="_blank" >
                      {"TX_ID:"+transactionHash.substring(0, 6)+"..."+transactionHash.substring(60)}({postedNetwork})
                      </a>
                    </h4>
                  
                  
                  </div>
                
                
            
                  <h3 className="text-3xl mb-2 font-semibold leading-normal">
                    {postDetailInf.title}
                  </h3>
                  
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
                            <img  src={`https://ipfs.io/ipfs/${postDetailInf.content.imageurl}`}   />
                          </div>
                        </div>
                      )}
                      
                      
                      {(postDetailInf.postSort==2)&&(
                        <div className="flex flex-wrap justify-right">
                          <a href={postDetailInf.content.data}>
                            {postDetailInf.content.data}
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
                                  <div  key={`post${postId}-pollitem${i}`} className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white ">
                                        <div className=" flex flex-row justify-start">
                                          <div className=" px-1 ">
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-teal-600 bg-teal-200 uppercase last:mr-0 mr-1">
                                              votes:{pollVoteInf.votes[i]}
                                            </span>
                                          </div>
                                          <div className=" px-1 ">
                                              <label className=" text-pink-500 border  font-bold uppercase text-xs px-1 py-1  ease-linear transition-all duration-150" 
                                                  >
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

                                    <div  key={`post${postId}-pollitem${i}`} className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white ">
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
                                    
                                    // <div  key={`post${postId}-pollitem${i}`}>
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
                  <div className="flex flex-wrap mt-5 mb-8">                
                  
                  <span className={statPercentColor + " mr-2"}>
                    
                      <i className="far   fa-comment-alt"></i>{" comment"}  {postOtherInf.commentcount}
                  </span>
                  {account&&active ?(
                    <>
                      {(account.toLowerCase()!=postDetailInf.creator.toLowerCase())&&
                      <button className={statPercentColor + " mr-2"} onClick={awardToThisPost}>
                        
                          <i className="fas   fa-gift"></i>award
                      </button>
                      }
                      {(account.toLowerCase()!=postDetailInf.creator.toLowerCase())&&
                        <span className={statPercentColor + " mr-2"} >
                          
                            <i className="fas   fa-gift"></i> Your Awards  {postOtherInf.userAwards}
                        </span>
                      }
                    </>
                    ):(<>
                      <button className={statPercentColor + " mr-2"} onClick={awardToThisPost}>
                            
                            <i className="fas   fa-gift"></i>award
                        </button>
                    </>)
                  }
              
          
                    {"   "}
                    {/* <Link 
                        to={`/user/postdetail/${postId}`}>
                    <span className={statPercentColor + " mr-2"}>
                        <i className="fas fa-share"></i>{" "}share
                    </span>
                    </Link> */}
                    {"   "}
                    {/* <span className={statPercentColor + " mr-2"}>
                        <i className="fas fa-bookmark"></i>{" "}save 
                    </span>  */}


                  </div>
                </div>
              

                
              </div>
               {/* ----------------reply comment button */}
           
              <div >
                <div className="flex flex-wrap">
                
                  <div className="w-full lg:w-12/12 px-4">

                    <h3 className="text-2xl mb-2 font-semibold leading-normal">
                      Write a comment
                    </h3>
                    <div className="relative w-full mb-3 border-1">                   
                      <div  className= "relative w-full mb-3"id="link1"  >            
                        <ReactQuill theme="snow"
                            className="rounded"
                            modules={modules}
                            placeholder={"Write content..."}
                            value={commentDescription} onChange={setCommentDescription}
                            // style={{ minHeight: 100, marginBottom: '50px' }} 
                          required/>           
                      </div>
                    </div>
                  </div>
                  
                </div>          
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      
                      </h6>
                      {(chainId==postedChainId)&&account&&active&&(
                        <button
                        className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        onClick={(e)=>onWriteButtonClick(e,0)}
                        
                      >
                        Write a Comment
                      </button>      
                      )}   
                      {!account&&(
                        <button
                          className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-3 ease-linear transition-all duration-150"
                          onClick={()=>{setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()])}}
                        >
                          connect wallet 
                        </button>       
                      )} 
                      {(chainId!=postedChainId)&&account&&(
                         <button
                         className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-3 ease-linear transition-all duration-150"
                         onClick={()=>{setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()])}}
                       >
                         switch wallet 
                       </button>       
                      )}   
                 
                  </div>
                </div>
              </div>
          
              
              
            </div>
            <hr className="mt-6 border-b-1 border-blueGray-300" />
            <div className="flex-auto pl-4">
              <h3 className="text-3xl mb-2 font-semibold leading-normal p-1">
                  Comment Details
              </h3>
              <div className="flex flex-wrap pl-4 pr-4">
                <div className="w-full lg:w-12/12 cus_timeline">
                  <ol className="relative border-l border-gray-200 dark:border-gray-700">
                    {comments.map((comment,i)=>{   
                    
                                  
                      return(
                      <CommentItem
                        key={`comment-${postId}-${i}`}
                        commentId={comment.commentId}
                        postId={postId}
                        privatekey={privateKey}
                        statPercentColor="text-emerald-500" 
                        account={account}
                        active={active}
                        chainId={chainId}
                        postType={postDetailInf.postType}
                        postedNetwork={postedNetwork}
                        postedchannelId={postedchannelId}
                        postedChainId={postedChainId}
                        postedContractAddress={postedContractAddress}
                        transactionHash={comment.transactionHash}
                        setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
                        />)

                    })}
                  </ol>
       



                </div>
              </div>
            </div>
          </div>
          
        </div>  
      </>)
    
}

