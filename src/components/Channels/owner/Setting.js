import React,{Fragment,useState,useEffect} from "react";
import CreatableSelect from 'react-select/creatable';
import  { components,  } from 'react-select'
import {  channelTopicOptions } from './data';
import  {jsonDataUploadtoIpfs} from "../../../ipfs/ipfs"
import {
  getWriteContract,

  editCommunityChannel} from "../../../Web3Api/Web3"
  import { ErrorToast,SuccessToast } from "../../toast/toast";
export default function Settings({account, active,chainId, channelDBInf, setSubmitting, channelInf,setIsOpenSwitchNetworkModal}) {
 

  const MyBoradContract=getWriteContract(chainId,account,active,'myboard')
  const [description, setDescription]=useState("");
  const [topics, setTopics]=useState([]); 
  const [changeState,setChangeState]=useState(false)
  
 
  useEffect(()=>{
    
    if(channelInf){
        setDescription(channelInf.inf.description)
        var _sel_topics=[]
        channelInf.inf.topics.map((topic)=>{
          _sel_topics.push({value:topic,label:topic,color:"#00B8D9"})
        });  
          
        setTopics(_sel_topics);   
    }
  },[channelInf])



  const  topicsHandleChange = (
    newValue,
    actionMeta
  ) => {
    setTopics(newValue);
    setChangeState(true)
 
  };
  const DropdownIndicator = (
    props
    ) => {
      return (
        <></>
      );
  };
  const ClearIndicator = (
    props
    ) => {
      return (
        <></>
      );
  }
  
  const Control = (
      props
    ) => {
    
    return (
      <Fragment>  
           
        <components.Control
          {...props}
        >
          <div className="relative w-full mb-3 ">
           <div className="flex items-center justify-between px-3 py-2  dark:border-gray-600">
          {props.children}
          </div>
          <div className="flex items-center justify-between px-3 py-2  dark:border-gray-600">
            <p > </p>
            <div className="flex pl-0 space-x-1 sm:pl-2">
                <button className="text-red-500 background-transparent font-bold uppercase px-1 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                  Cancel
                </button>
                <button className="text-lightBlue-500 background-transparent font-bold uppercase px-1 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
                  Save
                </button>
            </div>
  
        </div>
        </div>
        </components.Control>
     
       
      </Fragment>
    );
  };
  const IndicatorSeparator =(props)=>{
  
    return (
      <></>
    );
  }

  async function SaveSettingChange(){
    if(!account||!active||channelDBInf.chainId!=chainId){
      console.log(channelDBInf.chainId,chainId)
      setIsOpenSwitchNetworkModal([true,true,channelDBInf.chainId.toString()]);
      return
    }
    var _content=channelInf.inf;
    _content.description=description;
    var _topics=[];
    topics.map((topic)=>{
      _topics.push(topic.value);
    })
    _content.topics=_topics; 
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
    var res=await editCommunityChannel(chainId,MyBoradContract,account,channelInf.channelId,contentUrl,channelInf.iconImgUrl,topics_str)
    if(res=="success"){
      SuccessToast("Saved successfully")     
      setChangeState(false)
    }   
    else{
      ErrorToast("Save failed")
    }
    setSubmitting("ready");
  
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-green-600 mb-0 px-6 py-3">
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold mt-1">Community setting</h6>
            {changeState&&(
              <button type="button" 
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2   pr-6 pl-6"
              onClick={SaveSettingChange}>
                Save
              </button>
            )}
             
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            {/* <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              community profile
            </h6> */}
            <div className="flex flex-wrap">
         
              <div className="w-full ">
                <div className="relative w-full mb-3 mt-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Community topic
                  </label>
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold ">
                    This will help Reddit recommend your community to relevant users and other discovery experiences.
                  </h6>
                 {topics.length>0&&(
                  <CreatableSelect
                    isMulti
                    onChange={topicsHandleChange}
                    options={channelTopicOptions}                    
                    defaultValue={topics}
                    isClearable
                    isSearchable
                    components={{ DropdownIndicator,ClearIndicator,IndicatorSeparator }}
                    name="color"                
    
                  />
                  )}
                  {topics.length==0&&(
                  <CreatableSelect
                    isMulti
                    onChange={topicsHandleChange}
                    options={channelTopicOptions}                    
                    defaultValue={[]}
                    isClearable
                    isSearchable
                    components={{ DropdownIndicator,ClearIndicator,IndicatorSeparator }}
                    name="color"                
    
                  />
                  )}
                </div>
              </div>
             
              <div className="w-full ">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  
                    rows="4"
                    value={description}
                    onChange={(e)=>{setDescription(e.target.value); setChangeState(true);}}
                  ></textarea>
                </div>
              </div>
              <div className="w-full ">
                <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    send welcome message to Members
                  </label>
                <div className=" flex justify-between">
                  <h6 className="text-blueGray-400 text-sm mb-6 font-bold ">
                    This will helop Reddit recommend your community to relevant users and other discovery experiences.
                  </h6>
                  <div className="text-center">
                    <label htmlFor="default-toggle" className="relative inline-flex items-center  cursor-pointer">              
                      <input type="checkbox" value="" id="default-toggle" className="sr-only peer"/>
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      
                    </label>
                  </div>
                </div>
              </div>
             


              
            </div>

            

            
          </form>
        </div>
      </div>
    </>
  );
}
