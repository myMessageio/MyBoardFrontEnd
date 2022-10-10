import React, { useEffect, useState,Fragment  } from "react";
import { Link } from "react-router-dom";
import {  toast } from 'react-toastify';
import Loading from "../../Loading/loading" ;

// import {reddit_address,mesa_address,reddit_abi,mesa_Abi,
//   getChannelInf,joinChannel,getChannelJoinedUsers} from "../../../MoralisApi/MoralisWeb3"
import {
  getWriteContract,
  editCommunityChannel,
  joinChannel} from "../../../Web3Api/Web3"
import CreatableSelect from 'react-select/creatable';
import  { components, DropdownIndicatorProps,ClearIndicatorProps,IndicatorSeparatorProps   } from 'react-select'
import { channelTopicOptions,  } from '../owner/data';



import RuleSideItem from "../owner/RuleSideItem"


import {jsonDataUploadtoIpfs} from  "../../../ipfs/ipfs"
import { ErrorToast,SuccessToast } from "../../toast/toast";
import { backendPostRequest } from "../../../axios/backendRequest";
import { getUserProfile } from "../../../Web3Api/Web3";
export default function SideUserInf({account,
  chainId,
  active ,
  channelDBInf,
  channelInf,
   
  setSubmitting,setIsOpenSwitchNetworkModal
                         
}) {
  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")

  const [descriptionEditState,setDescriptionEditState]=useState(false);
  const [editDescription,setEditDescription]=useState("");  
  const [description,setDescription]=useState();
  const [enableLetterNumber,setEnableLetterNumber]=useState(500)
  const [topicEditState,setTopicEditState]=useState(false);
  const [topics,setTopics]=useState([]);
  const [editTopics,setEditTopics]=useState([]);
  const [createdTime, setCreatedTime]=useState("")

  const [joinedState,setJoinedState]=useState(false)

  const [changeState,setChangeState]=useState(false)

  const [jointUsers,setJointUsers]=useState([]);
  useEffect(()=>{  
    if(channelInf){        
      setDescription(channelInf.inf.description);
      setTopics(channelInf.inf.topics);      
      var  date =new Date(channelInf.timestamp*1000);     
      setCreatedTime(date.toLocaleString('sv'))
      setJoinedState(channelInf.joined)

      getChannelJoinedUsers();
    }
  },[ channelInf])
  useEffect(()=>{ 

  },[jointUsers])
  
  
 
  ////////description Edit function
  function editDescriptionStart(){

    setDescriptionEditState(true);
    setEditDescription(description);
    setEnableLetterNumber(500-description.length);

  }
  //////channelJoin
  async function joinCommuntyChannel(){
    if(!account||!active||channelDBInf.chainId!=chainId){
      setIsOpenSwitchNetworkModal([true,true,channelDBInf.chainId.toString()]);
      return
    }
    if(joinedState)
    setSubmitting("joiningout")
    else
    setSubmitting("joining")

    var res = await joinChannel(chainId,MyBoardContract, account,channelDBInf.channelId )
    if(res=="success"){
      if(joinedState)
      SuccessToast("Joined out successfully")
      else{
        SuccessToast("Joined successfully")
      }
    }
    else{
      if(joinedState)
      ErrorToast("Join out Failed")
      else
      ErrorToast("Join Failed")
    }
    setSubmitting("ready")
    setJoinedState(!joinedState)
  }

  /////////topic edit function 
  function   editTopicsStart(){
    var _sel_topics=[]
    topics.map((topic)=>{
      _sel_topics.push({value:topic,label:topic,color:"#00B8D9"})
    });
    setEditTopics(_sel_topics);
    setTopicEditState(true);
  }
  function selTopicsSave(){
    var _sel_topics=[]
    editTopics.map((topic)=>{
      _sel_topics.push(topic.value);
    });
    setTopics(_sel_topics);
    setTopicEditState(false);
    setChangeState(true)
  }
   //////topic edit component function 
  const  topicsHandleChange = (
    newValue,
    actionMeta
  ) => {
    setEditTopics(newValue);
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
                <button className="text-red-500 background-transparent font-bold uppercase px-1 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                type="button"
                onClick={()=>setTopicEditState(false)}>
                  Cancel
                </button>
                <button className="text-lightBlue-500 background-transparent font-bold uppercase px-1 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                type="button"
                onClick={selTopicsSave}>
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
      setIsOpenSwitchNetworkModal([true,true,channelDBInf.chainId.toString()]);
      return
    }
    var _content=channelInf.inf;
    _content.description=description;
    _content.topics=topics; 
    setSubmitting("uploadingToIpfs")    
    var contentUrl=await jsonDataUploadtoIpfs(JSON.stringify(_content));
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
      SuccessToast("Saved succesfully")
    }else{
      ErrorToast("Failed Saved")
    }
    setSubmitting("ready")
    setChangeState(false);
  }

  async function getChannelJoinedUsers(){
    var formData= new FormData()
    formData.append('channelId',channelDBInf.channelId);
    formData.append('network',channelDBInf.network);
    formData.append('contractaddress',channelDBInf.contractaddress);
    formData.append('offset',0);
    var res =await backendPostRequest("channel/joinedusers",formData);   
 
    if(res.status==200){
      if(res.data){
        var memberusers=[];
      
        for(let user of   res.data.joinusers){      
          var seluser=await getUserProfile(user.joiner);
          memberusers.push(seluser)
        }
 
        setJointUsers(memberusers)
      }
    }

  }
  
  return (
   
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-16">
        <div className="rounded-t bg-blue-500 mb-0 px-6 py-3"
        style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
          <div className="text-center flex justify-between">
            <h6 className="text-white text-lg font-bold">About Community</h6>
            <Link
              className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              to={`/channel/${channelDBInf.did}/owner/queues/modqueues`}>
           
              Settings
            </Link>
          </div>
        </div>
        <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
          <div className="flex flex-wrap">
            <div className="w-full  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left flex items-center mt-2 mb-4">
              <span className="w-12 h-12 text-xl text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
                style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
                {channelInf.inf.appearance.iconImg_Url==""&&(
                  <>  {"r/"+channelInf.name.substr(0,1)}</>
                )}
                {channelInf.inf.appearance.iconImg_Url!=""&&(
                <img
                    src={`https://ipfs.io/ipfs/${channelInf.inf.appearance.iconImg_Url}`}
                    // className="h-12 w-12 bg-white rounded-full border"
                    className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                    alt="..."
                  ></img>
                )}
              </span>
              <span className="ml-3 font-bold text-blueGray-600 text-sm ">
                {channelInf.name}
              </span>
            </div>
          </div>
        
          <div className="flex flex-wrap">
            <div className="w-full ">
              {!descriptionEditState&&(
                <div className="relative w-full mb-3 hover:outline-none hover:ring">
                  {description!=""&&(
                    <label
                      className="block  text-blueGray-600 text-sm  mt-1 "
                    
                    >
                      {description}
                      <button className=" background-transparent font-bold uppercase px-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                        type="button"
                        onClick={editDescriptionStart }
                        >                    
                        <i className=" text-lightBlue-500 fas fa-pencil-alt"></i>
                      </button>
                    </label>
                  )}
                  {description==""&&(
                  
                    <button className=" background-transparent  text-blueGray-400 font-bold  px-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                        type="button"
                        onClick={editDescriptionStart }
                        >                    
                        Add Description
                    </button>
                  
                  
                )}
                  
                </div>
              )}
              {descriptionEditState&&(
                <div className="relative w-full mb-3 ring">
                  <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                      <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                        
                          <textarea id="comment" rows="4" className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                          placeholder="Write a description..."
                            onChange={(e)=>{                                
                                  setEditDescription(e.target.value.toString().substring(0,499));
                                    setEnableLetterNumber(500-e.target.value.length);
                                  }}
                            value={editDescription}
                            required></textarea>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2  dark:border-gray-600">
                          <p className="block  text-blueGray-400 text-sm  mt-1 " >
                          you can enter {enableLetterNumber} letters
                          </p>
                          <div className="flex pl-0 space-x-1 sm:pl-2">
                              <button className="text-red-500 background-transparent font-bold uppercase px-1 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                              type="button"
                              onClick={()=>setDescriptionEditState(false)}>
                                Cancel
                              </button>
                              <button className="text-lightBlue-500 background-transparent font-bold uppercase px-1 py-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                              type="button"
                              onClick={()=>{setDescriptionEditState(false); setDescription(editDescription);setChangeState(true)}}>
                              Save
                              </button>
                          </div>

                      </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        

          <hr className="mt-1 border-b-1 border-blueGray-300" />
          <div className="w-full  text-center ">
            <div className="flex justify-left py-2 lg:pt-2 pt-3">
              <div className="mr-4 pr-4  text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {channelDBInf.postedmembers}
                </span>
                <span className="text-sm text-blueGray-400"> Members</span>
              </div>
              <div className="mr-4 pr-4  text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {channelInf.joincount}
                </span>
                <span className="text-sm text-blueGray-400">Joined</span>
              </div>
              <div className="mr-4 pr-4   text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                {channelInf.postcount}
                </span>
                <span className="text-sm text-blueGray-400">posts</span>
              </div>
              
            </div>
          </div>
          <hr className="mt-1 border-b-1 border-blueGray-300 " />
      
          
          <div className="relative w-full mt-2 py-2">
              <label
                className="block  text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                <i className=" text-blueGray-400 fas fa-clock text-sm "></i>  created on { createdTime} 
                {" "} by 
               <Link className="text-black" to={`/user/${channelDBInf.creator}`} >{" "+channelDBInf.creator.substr(0,6)+"..."+channelDBInf.creator.substr(38)}</Link>
              
              </label>

          </div>
          <hr className="mt-1 border-b-1 border-blueGray-300" />
        
          <div className="relative w-full mt-2">
            <label
              className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Community topics
            </label>
            
            <div className="relative w-full mb-3  hover:outline-none hover:ring">
              {!topicEditState&&(
              <>
                {topics.map((topic, i)=>{
                  return(
                    <span
                    key={"topic"+i}
                     className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">{topic}</span>
                  )
                })}
                {/* <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">Default</span> */}
                {/* <span className="bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Dark</span>
                <span className="bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">Red</span> */}
                {topics.length>0&&(
                <button className=" background-transparent font-bold uppercase px-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                      type="button"
                      onClick={editTopicsStart}
                      >
                    
                      <i className=" text-lightBlue-500 fas fa-pencil-alt"></i>
                    </button>
                )}
                {topics.length==0&&(
                  <button className=" text-blueGray-400 background-transparent font-bold  px-1 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                    type="button"
                    onClick={editTopicsStart}
                    >
                  
                    Select topics
                  </button>
                )}
              </>)}
              
              {topicEditState&&(<CreatableSelect
                isMulti
                onChange={ topicsHandleChange}
                options={channelTopicOptions}
                components={{ DropdownIndicator,ClearIndicator,Control,IndicatorSeparator }}
                defaultValue={editTopics}
                isClearable
                isSearchable
              
                name="color"                

              />)}
              
                  
              
            </div>

            
          </div>
        
          {/* <hr className="mt-1 border-b-1 border-blueGray-300" />
          <div className="relative w-full mt-2">
            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">Toggle me</span>
            <label for="default-toggle" className="relative inline-flex items-center  cursor-pointer">              
              <input type="checkbox" value="" id="default-toggle" className="sr-only peer"/>
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              
            </label>
          </div> */}
          {/* <hr className="mt-1 border-b-1 border-blueGray-300" />
          <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            
                create post
            
          </button>     */}
          <div className="relative w-full mt-2">
            <div className="text-center flex justify-end">
            
              {changeState&&(
                <button
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  onClick={SaveSettingChange}
                >
                  Save all Changes
                </button>
              )}
            </div>
          </div> 
          <div className="flex flex-wrap">           
              <div className="relative w-full mb-3 text-center mt-6  ">
              
                  {!joinedState&&(
                  <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-blue-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                    onClick={joinCommuntyChannel}>
                    <span className="w-full text-xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      JOIN
                    </span>
                  </button>
                  )}
                  {joinedState&&(
                  <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                  onClick={joinCommuntyChannel}>
                    <span className="w-full text-xl relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      JOINED
                    </span>
                  </button>
                  )}
          
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-16">
        <div className="rounded-t  mb-0 px-6 py-3 bg-blue-500"
        style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
          <div className="text-center flex justify-start">
            <h6 className="text-white text-xl font-bold">Moderators</h6>
          
          </div>
        </div>
        <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
          {/* <div className="flex flex-wrap">           
              <div className="relative w-full mb-3 text-center mt-6  ">
                 
                  <button className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      send message
                    </span>
                  </button>
          
            </div>
          </div> */}
          {jointUsers.length>0&&(
              <div className="relative w-full mt-2">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Join users
                </label>
            
                {jointUsers.map((memberuser,i)=>{                               
                  return(                 
                     
                      <div className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-2  text-left flex items-center">
                        <span className="w-10 h-10 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                          <img
                              src={`https://ipfs.io/ipfs/${memberuser.profileImgUrl}`}
                              // className="h-12 w-12 bg-white rounded-full border"
                              className="w-full w-10 h-10 rounded-full align-middle border-none shadow-lg"
                              alt="..."
                            ></img>
                        </span>
                          <span className="ml-3 font-bold text-blueGray-600 text-lg">
                            {memberuser.username}
                            ({memberuser.address.substring(0,6)+"..."+memberuser.address.substring(38)})
                          </span>
                      </div>                    
                   
                    )
                })}
              </div>
            )}          
          
          <div className="relative w-full mt-2">
            <div className="text-center flex justify-end">
            
              <Link
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
               
                to={`/channel/${channelDBInf.did}/owner/users/joined`}
              >
                view all moderators
              </Link>
            </div>
          </div>    
        </div>
      </div>

      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 mt-16">
        <div className="rounded-t  mb-0 px-6 py-3 bg-blue-500"
        style={{backgroundColor:channelInf.inf.appearance.themeColor}}>
          <div className="text-center flex justify-start">
            <h6 className="text-white text-xl font-bold">Rules</h6>
          
          </div>
        </div>
        <div className="flex-auto px-5 lg:px-5 py-10 pt-2  bg-white">
          
          <div className="relative w-full mt-2">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg  bg-white">
          
              <div className="block w-full overflow-x-auto">
                {/* Projects table */}
                {channelInf.inf.rules.length>0&&(
                  <div id="accordion-collapse" >
                    {channelInf.inf.rules.map((rule,i)=>{
                      return (<RuleSideItem no={i+1} rule={rule}/>
                        )
                      })}
                  
                  </div>
                )}
              </div>
            </div>
            
    
          </div>
          <div className="relative w-full mt-2">
            <div className="text-center flex justify-end">
            
              <Link
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
               
                to={`/channel/${channelDBInf.did}/owner/others/rules`}
              >
               Add Rules
              </Link>
            </div>
          </div>    
      
  
        
        
        </div>
      </div>
    </>
  
  );
}
