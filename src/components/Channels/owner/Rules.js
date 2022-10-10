
import React,{useState,useEffect} from "react";
import AddRuleModal from "../../modal/AddRuleModal"


// import TableDropdown from "components/Dropdowns/TableDropdown.js";
import RuleItem from "./RuleItem"
import  {jsonDataUploadtoIpfs} from "../../../ipfs/ipfs"
import { ErrorToast,SuccessToast } from "../../toast/toast";
import {
  getWriteContract,

  editCommunityChannel} from "../../../Web3Api/Web3"
export default function Rules({account, chainId,active,channelDBInf,setSubmitting,channelInf,setIsOpenSwitchNetworkModal}) {
  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")
  const [isOpenAddRuleModal,setIsOpenAddRuleModal]=useState(false)
  const [rules,setRules]=useState([]);
 
  useEffect(
    ()=>{
      
        console.log(channelInf,account)
        var _rules=[];
        channelInf.inf.rules.map(rule=>{
          _rules.push(rule)
        })
        setRules(_rules)
   
    },[channelInf])
 

   async function SaveSettingChange(newRule){
    var _content=channelInf.inf;  
    var _rules=[]
    rules.map(rule=>{
      _rules.push(rule)
    })
    _rules.push(newRule)  
    _content.rules=_rules
    setSubmitting("uploadingToIpfs")
    var contentUrl=await jsonDataUploadtoIpfs(_content);  
    if(!contentUrl){      
      ErrorToast("Error occurs in IPFS Uploading")
      setSubmitting("ready");
      return;

    }
    setSubmitting("saving")    
    var topics_str="no"
    if(_content.topics.length>0){
      topics_str=_content.topics.toString()
    }
    var res=await editCommunityChannel(chainId,MyBoardContract,account,channelInf.channelId,contentUrl,channelInf.iconImgUrl,topics_str)
    if(res=="success"){
      SuccessToast("Saved successfully")
      setRules(_rules)
      
    }   
    else{
      ErrorToast("Save failed")
    }
    setSubmitting("ready");
  
  }

  // const [postlist, setpostlist]=useState([]);
  
  return (
    <>
    {isOpenAddRuleModal&&(<AddRuleModal setIsOpenModal={setIsOpenAddRuleModal}  SaveSettingChange={SaveSettingChange}/>)}
      <div
        className=
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-100"
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 bg-green-600 mb-2">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <div className="text-center flex justify-between">
                <h3  className= "font-semibold text-lg text-white mt-1" >
                  Rules List
                </h3>
                {account&&channelDBInf&&(<>
                  {(account.toLowerCase()==channelDBInf.creator.toLowerCase())&&(
                    <button type="button"
                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:no-outline dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                      onClick={()=>{
                        if(!account||!active||channelDBInf.chainId!=chainId){
                          console.log(channelDBInf.chainId,chainId)
                          setIsOpenSwitchNetworkModal([true,true,channelDBInf.chainId.toString()]);
                          return
                        }
                        setIsOpenAddRuleModal(true)}}
                    >
                      +Add Rules
                    </button>
                  )}
                  </>
                )}
              </div>
            </div>
          </div>
         

        </div>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg  bg-white">
        
          <div className="block w-full overflow-x-auto">
            {/* Projects table */}
            <div id="accordion-collapse" >
              {rules.map((rule,i)=>{
                return (<RuleItem no={i+1} rule={rule}/>
                  )
                })}
             
              </div>
          </div>
        </div>
      </div>
    </>
  );
}

