import React, { useEffect, useState }  from "react";
import Loading from "../../components/Loading/loading" ;
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

import Moment from 'react-moment';
import {

 getCommentInf,
 
 } from "../../Web3Api/Web3"
import { chainScanUrls } from "../../Web3Api/env";
export default function UserCommentId({
  statPercentColor,
  commendDBData,
  privatekey,
  account,  
  postType,  
  selaccount,
  active,
  showtype,
  chainId
  


}) {

 


  const[submitting, setSubmtting]=useState('ready')

  ////getComment information
  const [[commentInf,commentOtherInf],setcommentInf]=useState([null,null])
  const [copyItemName,setCopyItemName]=useState('')

  ///replyinfr

  //////IPFS

  ////////posting function
  useEffect(()=>{////first upload hook   
    
      getCommendDataInf()   
  

  },[commendDBData,account])
  useEffect(()=>{},[copyItemName])

 




  async function getCommendDataInf(){
    // if(commentauthor==selaccount.toLowerCase()){   
    const [detailinf,otherinf]=await getCommentInf(account,commendDBData.commentId,"no",commendDBData.network);
    setcommentInf( [detailinf,otherinf])  
    // }
   
  }


 
    
  /////getcommentInfo
  
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
     
      {submitting=="approving"&& (
              <Loading title="approving"/>
          ) }
     
        <li className=" ml-3 ">            
         
            <> 
              {commentInf&&(
                <div className="relative w-full max-w-full flex-grow  flex-1  bg-blueGray-200 p-3 mt-1 mb-1  border-t">
                  <div className="text-center flex justify-between mt-1">
                
                    <h5 className="text-blueGray-400  font-bold text-xs">
                      <span className={ " text-black mr-2"}> commented by</span>
                      {commentInf.creator.substring(0,6)+"..."+commentInf.creator.substring(38)}

                      {" "}
                      <button onClick={()=>{navigator.clipboard.writeText(commentInf.creator);
                            setCopyItemName("creator")}}><i className={copyItemName!="creator"?("far fa-copy"):("fas fa-copy")}></i></button>
              
                      &nbsp; &nbsp; <span className={statPercentColor + " mr-2"}><Moment fromNow>{commentInf.created_at}</Moment></span> 
                        
                    </h5>
                    
                                   
                      <h4 className="text-blueGray-400  font-bold text-xs">
                        <a  href={`${chainScanUrls[commendDBData.network]}/tx/${commendDBData.transactionHash}`}   target="_blank" >
                        {"TX_ID:"+commendDBData.transactionHash.substring(0, 6)+"..."+commendDBData.transactionHash.substring(60)}({commendDBData.network})
                        </a>

                        {" "}
                      <button onClick={()=>{navigator.clipboard.writeText(commendDBData.transactionHash);
                            setCopyItemName("transactionHash")}}><i className={copyItemName!="transactionHash"?("far fa-copy"):("fas fa-copy")}></i></button>
              
                      </h4>
                  
                  
                  </div>
                  {commentInf.content&&(
                  <div className="ql-editor mt-2 "     style={{height:"auto", padding:0}}>
                    <div dangerouslySetInnerHTML={{__html: commentInf.content}}></div>
                  </div>   )}  
                
                  {/* <div className="flex flex-wrap mt-2 mb-2">    
              
                    <button className={statPercentColor + " mr-2"}>
                      <i className="fas fa-thin  fa-comment"></i>{" "}reply 
                    </button>    
                              
                  </div>              */}
                </div>
              )}
             
            </>
         
         
        </li>
     
    
     
    </>
  );
}

