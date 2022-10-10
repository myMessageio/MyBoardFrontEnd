import React, { useEffect, useState } from "react";
// components
import { useParams  } from 'react-router-dom';
import PostDetail from "../../components/Posts/PostDetail.js";
import PrivateCheckForm from "../../components/Posts/privateCheckForm"; 
import PayFrom  from "../../components/Posts/payForm"; 
import SideUserInf from "../../components/Users/SideUserInf";


import {
 getPostInf,
 privateKeyCheck,
 viewPaidContentPermit,
 MesaTokenApprove,
 getMESAAAllowanceOfUser,
 getMESABalanceOfUser 
 } from "../../Web3Api/Web3"
import { viewPaidContentPayAmount } from "../../Web3Api/env.js";
 import { getWriteContract } from "../../Web3Api/Web3";
import { SuccessToast,ErrorToast } from "../../components/toast/toast.js";
import Loading from "../../components/Loading/loading" ;

import { backendPostRequest } from "../../axios/backendRequest.js";
export default function PostDetalView({account,currentUserProfile, active,chainId,setIsOpenSwitchNetworkModal}) {
 
 
  const { did } = useParams(); 
  const [selPostDBData,setSelPostDBData]=useState(null);
  const [[postDetailInf,postOtherInf,pollVoteInf],setPostInf]=useState([null,null,null])

  const [privateKey, setPrivateKey]=useState("no")
  const [privateKeyChecked, setPrivateKeyChecked]=useState(false)
  const[submitting, setSubmitting]=useState('ready')

  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")
  const MesaTokenContract=getWriteContract(chainId,account,active,"mesa")
  useEffect(()=>{
    if(did){
      console.log(did)
      getPostDataFromBackend();
    }
  },[did])
  
  useEffect(()=>{////get start informaton  
    if(selPostDBData)   {
    
      getPostDataInf()
  
      
    
    }  
     
  },[active,account,selPostDBData,privateKey])  

  useEffect(()=>{   

  },[postDetailInf])

  async function privateKeyChecking(e){
    e.preventDefault();
    var res=await privateKeyCheck(account,selPostDBData.postId,privateKey,selPostDBData.network)
    setPrivateKeyChecked(res)

  }

  async function payToAuthor(){       
    var balance = await getMESABalanceOfUser(account,selPostDBData.network)
    var allowanceAmount = await getMESAAAllowanceOfUser(account,selPostDBData.network)  

    if(viewPaidContentPayAmount>Number(balance)/Math.pow(10,18)){      
      ErrorToast("You don't have enought MESA Tokens in your wallet")  
      setSubmitting("ready")
      return;
    }
  
    if(viewPaidContentPayAmount>Number(allowanceAmount)/Math.pow(10,18)){
      
      setSubmitting("approving")
      var res=await MesaTokenApprove(chainId,MesaTokenContract,account,viewPaidContentPayAmount)
      if( res=="success"){
        SuccessToast("Approved successfully")
        
      }else{
        ErrorToast("failed in approving")  
        setSubmitting("ready")
        return;    
      }
    }
   
    setSubmitting("permitting")
    var res2=await viewPaidContentPermit(chainId,MyBoardContract,account,selPostDBData.postId)
      if( res2=="success"){
        SuccessToast("Awarded successfully")
        getPostDataInf()
        setSubmitting("ready")

      }else{
        ErrorToast("failed in permitting")       
      }
    setSubmitting("ready")
      
   
  

  }
  async function  getPostDataFromBackend(){
    let formData = new FormData();
    formData.append("did", did);    
    var res=await backendPostRequest("post/detail", formData);
    console.log(res)
    if(res.data.result=="success"){
      setSelPostDBData(res.data.post);
    }
  }
  async function getPostDataInf(){   
      const [postdetail,postother,postpollvote] =await getPostInf(account,selPostDBData.postId,privateKey,selPostDBData.network);
      setPostInf([postdetail,postother,postpollvote])
  }



  function postContentRender(){
    if(postDetailInf&&postOtherInf&&selPostDBData){
      if (postDetailInf.postType==0||(postDetailInf.postType==1&&privateKeyChecked)
        ||(postDetailInf.postType==2&&postOtherInf.paidstate)||account==postDetailInf.creator){  

              return(
      
            <PostDetail 
              account={account}
              postDetailInf={postDetailInf}
              postOtherInf={postOtherInf}
              pollVoteInf={pollVoteInf}
             
              postId={selPostDBData.postId}
              active={active}  
              currentUserProfile={currentUserProfile}
              statPercentColor="text-emerald-500"   
              privateKey={privateKey} 
              getPostDataInf={ getPostDataInf}      
              chainId={chainId}
              transactionHash={selPostDBData.transactionHash}
              setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
              postedChainId={selPostDBData.chainId}
              postedNetwork={selPostDBData.network}
              postedContractAddress={selPostDBData.contractaddress}
              postedchannelId={selPostDBData.channelId}
              channeldid={selPostDBData.channeldid}
            />  
          )
      
      }else if(postDetailInf.postType==1){  
        return(<PrivateCheckForm
          setPrivateKey={setPrivateKey}
          setPrivateKeyChecked={setPrivateKeyChecked}
          privateKeyChecking={privateKeyChecking}
                  
        />) 
      }else  if(postDetailInf.postType==2){  
        
        return(<PayFrom
       
          currentUserProfile={currentUserProfile}
          payToAuthor={payToAuthor}
          submitting={submitting}
          active={active} 
          chainId={chainId}
          account={account}
          postedChainId={selPostDBData.chainId}        
          setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
             
        
        />)    
      }else{
    
        return (<></>)
      }
    }else{
      return (<></>)
    }

  }
 
  return ( 
    <>
      {submitting=="approving"&& (
          <Loading title="approving"/>
          ) }
        {submitting=="permitting"&& (
          <Loading title="permitting"/>
          ) }
       
      <div className="px-4 md:px-10 mx-auto w-full py-10 ">
        <div className="container mx-auto">
          <div className="flex flex-wrap relative">
            {postDetailInf&&(
            <div className="w-full lg:w-4/12 px-4">
              <SideUserInf   
                seluseraccount={selPostDBData.creator}
             
            
                             />
            </div>)}
            
            {/* {postDetailInf&&postOtherInf&&authorInf&&(
              <div className="w-full lg:w-8/12 px-4 mt-12">
                <PostDetail 
                  account={account}
                  postDetailInf={postDetailInf}
                  postOtherInf={postOtherInf}
                  pollVoteInf={pollVoteInf}
                  authorInf={authorInf}
                  postId={postId}
                  active={active}  
                  currentUserInf={currentUserInf}
                  statPercentColor="text-emerald-500"          
                />
              </div>
            )} */}
            {postContentRender()}
            
          </div>
        </div>
      </div>

      
    </>
  );
}
