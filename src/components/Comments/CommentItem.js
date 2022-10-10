import React, { useEffect, useState, }  from "react";
import Loading from "../../components/Loading/loading" ;
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';
import { 
  getWriteContract,
  getCommentInf,
  createComment,
  awardToComment,
  commentVoteUpSet,
  commentVoteDownSet, 
  MesaTokenApprove, 
  getMESABalanceOfUser,
  getMESAAAllowanceOfUser

} from "../../Web3Api/Web3"
 import {awardTokenAmount,chainScanUrls}  from "../../Web3Api/env"

import {mainDataEncryptUploadToIpfs} from '../../ipfs/ipfs'
import {SuccessToast,ErrorToast} from "../toast/toast"

import Moment from 'react-moment';

import { backendPostRequest } from "../../axios/backendRequest";
export default function CommentItem({
  statPercentColor,
  commentId,
  postId,
  privatekey,
  account,
  chainId,
  active,
  postType,
  transactionHash,
  postedNetwork,
  postedchannelId,
  postedChainId,
  postedContractAddress,
  setIsOpenSwitchNetworkModal,
}) {



  const[submitting, setSubmitting]=useState('ready')
  const [[commentInf,commentOtherInf],setcommentInf]=useState([null,null])
  const [subcomments,setSubComments]= useState([])
  ///replyinfr
  const [replydescription,setReplyDescription]=useState('')
  const [replystate,setReplystate]=useState(false)
  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")
  const MesaTokenContract=getWriteContract(chainId,account,active,"mesa")
  const [copyItemName,setCopyItemName]=useState("")
  ////////posting function
  useEffect(()=>{////first upload hook 
  
    if(commentId>0) {
      getCommendDataInf()       
      getSubCommants()
    } 

  },[commentId,active,account])
  
  useEffect(()=>{
   
  
  },[commentInf,copyItemName])

    ///////quill
    const modules={
    
      toolbar: [
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ align: [] }],
    
        [{ list: 'ordered'}, { list: 'bullet' }],
        [{ indent: '-1'}, { indent: '+1' }],
         [{ 'script': 'sub' }, { 'script': 'super' }],
        
        ['link', 'image' ],
        [{ color: [] }, { background: [] }],
    
        ['clean'],
      ],
      clipboard: {
        matchVisual: false,
      },
      blotFormatter: {}
      
    
  }
  
  const { quill, quillRef, Quill } = useQuill({
    theme:"snow",
    modules: modules,
    placeholder:"Write a comment..."
  });
  
  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register('modules/blotFormatter', BlotFormatter);
  }
  
  
  ////quill effect
  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldContents) => {     
        setReplyDescription(quill.root.innerHTML)
      });
    }
  }, [quill, Quill]);
  function contentclear(){
    quill.root.innerHTML="";
  }
  
  ////
  


  async function getSubCommants(){
 


    let formData = new FormData();
    formData.append("network", postedNetwork);
    formData.append("contractaddress",postedContractAddress)
    formData.append("postId",postId)    
    formData.append("parentId",commentId)  
    formData.append("channelId",postedchannelId)
    var res=await backendPostRequest("comment/getsubcomments", formData);
    if(res.data.result=="success"){
     
      setSubComments(res.data.comments);
    }


  }

  async function getCommendDataInf(){
 
    const [detailInf, otherInfo]=await getCommentInf(account,commentId,privatekey,postedNetwork);  
    setcommentInf([detailInf, otherInfo])
  }
  ///reeply
  function reply(){
    setReplystate(true)
  }
  function cancelReply(){
    setReplystate(false)
  } 
  ///////ipfs function 




  async function commentReplying(contentUrl,encryptkey){
    
    if(!contentUrl){      
      ErrorToast("Error occurs in IPFS Uploading")
      setSubmitting("ready");
      return;
    }
    var cprivateKey="no";
    if(postType==1){
      cprivateKey=privatekey;
    }
    setSubmitting("submitting")
    var res= await createComment(chainId,MyBoardContract,account,postId,contentUrl,commentId,cprivateKey,encryptkey)
    if(res=="success"){
      SuccessToast("New comment was created successfully!")

      setReplyDescription('')
      contentclear()
      setReplystate(false)    
      getSubCommants()

    }else{
      ErrorToast("New comment Creating failed")
    }
    setSubmitting("ready")
   
    
   
  }

  async function onWriteButtonClick(e){
    e.preventDefault();
    if(replydescription==""||replydescription=="<p><br></p>"||replydescription=="<p></p>"){
      ErrorToast("You must select an descripton");
      return;
    }
    setSubmitting("uploadingToIpfs")  

    mainDataEncryptUploadToIpfs(JSON.stringify(replydescription),commentReplying);
 
 
  }
  
  async function awardToThisComment(){
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


    /////
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
    var res2=await awardToComment(chainId,MyBoardContract,account,commentId)     
      if( res2=="success"){
        SuccessToast("Awarded successfully")
        getCommendDataInf()
        setSubmitting("ready")

      }else{
        ErrorToast("failed in awarding")       
      }
    setSubmitting("ready")
  

}
  async function commentUpVote(){ 
    if(!account||!active||postedChainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()]);
      return
   
    }
    setSubmitting("voting")
    var res=await commentVoteUpSet(chainId,MyBoardContract,account,commentId)
    if(res=="success"){
      SuccessToast("voted successfully")
      getCommendDataInf()  
    }else{
      ErrorToast("failed in voting")
    }
    setSubmitting("ready")
  }
  async function commentDownVote(){
    if(!account||!active||postedChainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,postedChainId.toString()]);
      return
   
    }
  
   
      setSubmitting("voting")
      var res=await commentVoteDownSet(chainId,MyBoardContract,account,commentId)
      if(res=="success"){
        SuccessToast("voted successfully")
        getCommendDataInf()  

      }else{
        ErrorToast("failed in voting")
      }
      setSubmitting("ready")
    
  }

 

 

  return (
    <>
      {submitting=="submitting"&& (
              <Loading title="submitting"/>
          ) }
      {submitting=="voting"&& (
              <Loading title="voting"/>
          ) }
      {submitting=="uploadingToIpfs"&& (
              <Loading title="uploadingToIpfs"/>
          ) }
      {submitting=="awarding"&& (
            <Loading title="awarding"/>
        ) }
      {submitting=="approving"&& (
              <Loading title="approving"/>
          ) }
      {commentInf&&commentOtherInf&&(
        <li className="mb-3 ml-6 ">            
          <span className="flex absolute -left-2  items-center w-6 h-12 bg-white  ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
            <div className="relative w-auto mt-8  ">  
              <a onClick={()=>commentUpVote()}>
                <i className= {
                  "fas fa-arrow-up text-xl leading-lg" +
                  (commentOtherInf.voteState==1 ? " text-emerald-500" : " text-blueGray-400")
                }              
                  />
              </a>
              <div className="text-center justify-center text-2xl flex  ">
                <label> {commentInf.upvotes-commentInf.downvotes}</label>
               
              </div>
              <a  onClick={()=>{commentDownVote()}}>
                <i className={
                  "fas fa-arrow-down text-xl leading-lg" +
                  (commentOtherInf.voteState==2 ? " text-emerald-500" : " text-blueGray-400")
                } />
              </a>
            </div> 
            {/* <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg> */}
          </span>
          
          <div className="relative w-full max-w-full flex-grow  flex-1 bg-blueGray-200 p-1 mb-1">
            <div className="text-center flex justify-between mt-1">
            {commentInf&&(
              <h5 className="text-blueGray-400  font-bold text-xs">
                <span className={ " text-black mr-2"}> commented by</span>
                {commentInf.creator.substring(0,6)+"..."+commentInf.creator.substring(38)}
                {" "}
                <button onClick={()=>{navigator.clipboard.writeText(commentInf.creator);
                            setCopyItemName("creator")}}><i className={copyItemName!="creator"?("far fa-copy"):("fas fa-copy")}></i></button>
                  
                 &nbsp; &nbsp; <span className={statPercentColor + " mr-2"}><Moment fromNow>{commentInf.created_at}</Moment></span> 
                  
              </h5>)}
              
                              
              <h4 className="text-blueGray-400  font-bold text-xs">
                <a href={chainScanUrls[postedNetwork]+"/tx/" + transactionHash} target="_blank" >
                {"TX_ID:"+transactionHash.substring(0, 6)+"..."+transactionHash.substring(60)}({postedNetwork})
                </a>
                {" "}
                <button onClick={()=>{navigator.clipboard.writeText(transactionHash);
                            setCopyItemName("transactionHash")}}><i className={copyItemName!="transactionHash"?("far fa-copy"):("fas fa-copy")}></i></button>
                 
              </h4>
             
            
            </div>
            <div className="ql-editor mt-2 "     style={{height:"auto", padding:0}}>
              <div dangerouslySetInnerHTML={{__html: commentInf.content}}></div>
            </div>     
           
            <div className="flex flex-wrap mt-2 mb-2">    
              {!replystate&&(
              <button className={statPercentColor + " mr-2"} onClick={reply}>
                <i className="fas fa-thin  fa-comment"></i>{" "}reply 
              </button> )}  
              {account&&active ?(
                  <>
                    <button className={statPercentColor + " mr-2"} onClick={awardToThisComment}>
                      
                        <i className="fas   fa-gift"></i>award {commentInf.awardCount}
                        {commentInf.userAwards>0&&(<>(Yours {commentInf.userAwards})</>)}
                    </button>
                  </>
                  ):(<>
                    <button className={statPercentColor + " mr-2"} onClick={awardToThisComment}>
                          
                          <i className="fas   fa-gift"></i>award  {commentInf.awardCount}
                      </button>
                  </>)
                }         
            </div>             
          </div>
          {replystate &&(
              <div onSubmit={onWriteButtonClick}>
                <div className="flex flex-wrap">
                
                  <div className="w-full lg:w-12/12 px-4">
                    <h3 className="text-2xl mb-2 font-semibold leading-normal">
                      Write a comment
                    </h3>

                    <div className="relative w-full mb-3 border-1">                   
                      <div  className= "relative w-full mb-3"id="link1"  >            
                        <div ref={quillRef} className="rounded"/>            
                      </div>
                    </div>
                  </div>
                  
                </div>          
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      
                      </h6>
                    <div>
                    <button
                      className="bg-lightBlue-500 text-white active:bg-lightGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                    onClick={cancelReply}
                    >
                    Cancel
                    </button>
                    {(chainId==postedChainId)&&account&&active&&(
                        <button
                        className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        onClick={onWriteButtonClick}
                        
                      >
                       Reply
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
            )}
          <div className="flex flex-wrap pt-1">
            <div className="w-full lg:w-12/12 cus_timeline">
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
              {subcomments.map((subcomment,i)=>{ 
                console.log(subcomment)               
                return (
                  <CommentItem
                      key={`comment-${postId}-${subcomment.commentId}`}
                      statPercentColor="text-emerald-500"
                      commentId={subcomment.commentId}
                      postId={postId}
                      privatekey={privatekey}
                      account={account}                           
                      active={active}
                      postType={postType}
                      chainId={chainId}
                      postedNetwork={postedNetwork}
                      postedchannelId={postedchannelId}
                      postedChainId={postedChainId}
                      postedContractAddress={postedContractAddress}
                      transactionHash={subcomment.transactionHash}
              
                      />) 
                    
                })}

              </ol>
            </div>
          </div>
        </li>
     
      )}
     
    </>
  );
}

