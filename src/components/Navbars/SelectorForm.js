import React, { useEffect, useState }  from "react";
import  Loading from "../../components/Loading/loading";
import '../../assets/styles/selectsearch.css';

import {getWriteContract,createCommunityChannel,
  } from "../../Web3Api/Web3"
import  { components} from 'react-select'
import AsyncSelect from 'react-select/async';
import CreateChannelModal from "../../components/modal/createChannelModal";
import PostTypeModal from "../modal/PostTypeModal"
import {SuccessToast,ErrorToast} from "../toast/toast"
import {jsonDataUploadtoIpfs
  } from "../../ipfs/ipfs"
import { backendPostRequest } from "../../axios/backendRequest";
import { useLocation,useNavigate } from "react-router-dom";
import { contractAddresses } from "../../Web3Api/env";
export default function SelectForm(
  {account,active,chainId,selNetworks,setIsOpenSwitchNetworkModal}
) {

  const location=useLocation()
  const navigate = useNavigate() 
  // //////variable for posting
  const MyBoardContract=getWriteContract(chainId,account,"myboard")
  const [defaultOptions,setDefaultOptions]=useState([])  
  const [isOpenCreateChannelModal,setIsOpenCreateChannelModal]=useState(false) 
  const [isOpenPostTypeModal,setIsOpenPostTypeModal]=useState(false) 
  const[submitting, setSubmitting]=useState('ready')
  useEffect(()=>{
    
  },[location])
  useEffect(()=>{
    getDefaultOptions(setDefaultOptions)
  },[account,active,chainId,selNetworks])
  async function getDefaultOptions(callback){ 

  
    var selnetworkNames=[]
    var selcontractaddresses=[]
    for (let key in selNetworks) {
      if(selNetworks[key]){
        selnetworkNames.push(key);
        selcontractaddresses.push(contractAddresses[key]['myboard'])
      }
    }  
    
    if(selnetworkNames.length==0){
        var opt=[{label:"+Add Community Channel",value:"createchannel"},
                  {label:"+Create post",value:"createpost"} ]        
       
        callback(opt) 
      return  
    }else{ 
      if(account){    
        var selnetworksstr=selnetworkNames.toString()
        var selcontractaddrstr=selcontractaddresses.toString()
        let formData = new FormData();                  
        formData.append("selnetworksstr", selnetworksstr);
        formData.append("selcontractaddrstr", selcontractaddrstr); 
        formData.append("creator", account);         
        backendPostRequest("channel/userchannelsofall", formData).then(function(res){      
          var myChannels=[];
        var usedChannels=[]
        var popularChannels=[]  
        for(let channel of res.data.mychannels){    
          myChannels.push({label:channel.channelName ,value:"channel",color: '#0052CC',icon:channel.iconImgUrl,did:channel.did,network:channel.network})           
        }
        
        for(let channel of res.data.usedchannels){    
          usedChannels.push({label:channel.channelName ,value:"channel",color: '#0052CC',icon:channel.iconImgUrl,did:channel.did,network:channel.network})           
        }
        for(let channel of res.data.popularchannels){    
          popularChannels.push({label:channel.channelName ,value:"channel",color: '#0052CC',icon:channel.iconImgUrl,did:channel.did,network:channel.network})           
        }
        
          var opt=[{label:"+Add Community Channel",value:"createchannel"},
          {label:"+Create post",value:"createpost"},
                    {label:"my channels",options: myChannels},
                    {label:"used",options: usedChannels},
                    {label:"popular",options: popularChannels}
                  
                  ]       
          callback(opt)    
        }).then(function (error){
          if(error){
           
            var myChannels=[];
            var usedChannels=[]  
        
          
            var opt=[{label:"+Add Community Channel",value:"createchannel"},
            {label:"+Create post",value:"createpost"},
                      {label:"my channels",options: myChannels},
                      {label:"used",options: usedChannels} 
                    ]
                    callback(opt) 
          }
        });  

      }else{         
        let formData = new FormData();        
        var selnetworksstr=selnetworkNames.toString()
        var selcontractaddrstr=selcontractaddresses.toString()
        formData.append("selnetworksstr", selnetworksstr);
        formData.append("selcontractaddrstr", selcontractaddrstr); 
        backendPostRequest("channel/popular", formData).then(function(res){         
          var pupoularChannels=[]  
          for(let channel of res.data.channels){    
            pupoularChannels.push({label:channel.channelName ,value:channel.channelId,color: '#0052CC',icon:channel.iconImgUrl,did:channel.did,network:channel.network})           
          }          
          var opt=[{label:"+Add Community Channel",value:"createchannel"},
                  {label:"+Create post",value:"createpost"},                    
                    {label:"popular",options: pupoularChannels}                  
                  ]
          callback(opt)   
        }).then(function (error){
          if(error){
            var opt=[{label:"+Add Community Channel",value:"createchannel"},
            {label:"+Create post",value:"createpost"},                     
                    ]
            callback(opt) 
          }
        });  
       
      }   
    }   

  

  }
 

  function onSelectChannelChange(e,t){ 
   
    if(e){
        if(e.value=="createchannel"){
          if(active&&account){ 
          }else{
           setIsOpenSwitchNetworkModal([true,false,'0']);
           return
          }
          setIsOpenCreateChannelModal(true);
          return
        }else if(e.value=="createpost"){
          navigate('postcreate')
        }else{       
          navigate(`channel/${e.did}/posts`);
        }
      //setSelectChannelID(e.value)

    }
  }

  const handleInputChange = (newValue,t) => {   
    const inputValue = newValue.replace(/\W/g, '');     
    return inputValue;
  };

  const loadOptions = (
    inputValue,
    callback,
  ) => {  
    filterOption(inputValue,callback);  

  };

  function filterOption(keyword,callback){ 
   
    if(keyword==''){      
      getDefaultOptions(callback)
    }else{    
      var selnetworkNames=[]
      var selcontractaddresses=[]
      for (let key in selNetworks) {
        if(selNetworks[key]){
          selnetworkNames.push(key);
          selcontractaddresses.push(contractAddresses[key]['myboard'])
        }
      }  
      
      if(selnetworkNames.length==0){
          var opt=[]       
          callback(opt) 
        return  
      }else{   
        var selnetworksstr=selnetworkNames.toString()
        var selcontractaddrstr=selcontractaddresses.toString()
        let formData = new FormData();                  
        formData.append("selnetworksstr", selnetworksstr);
        formData.append("selcontractaddrstr", selcontractaddrstr);       
        formData.append("keyword", keyword);      
      
        backendPostRequest("channel/findforpost", formData).then(function(results){              
          var opt1=[]
          for(let channel of results.data.channels){ 
            opt1.push({label:channel.channelName ,value:"channel",color: '#0052CC',icon:channel.iconImgUrl,did:channel.did,network:channel.network})
      
          }
          callback(opt1)   

        }).then(function (error){
          if(error){
            var opt1=[]
            callback(opt1) 
          }
        
              
          
        });  
      }
    }
  }

  
  const ClearIndicator = (
    props
  ) => {
    return (
      <></>
    );
  }
 

  const IndicatorSeparator =(props)=>{

    return (
      <></>
    );
  }
  const Option = (props) => {      
    return (
      <components.Option {...props} >
        <div 
       
        className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left flex items-center border-teal-500 ">
        {props.data.value!="createchannel"&&props.data.value!="createpost"&&(
        <img
          src={`https://ipfs.io/ipfs/${props.data.icon}`}
          className="h-10 w-10 bg-white rounded-full border"
          alt="..."
        ></img>
        )}
        <span
          className=
            "ml-3 font-bold text-blueGray-600 p-2"                    
        >
          {props.data.label} {props.data.value!="createchannel"&&props.data.value!="createpost"&&(<>({props.data.network})</>)}
        </span>
      </div>
     </components.Option>      
  );
  };
  const Placeholder = (props) => {   
    return (<components.Placeholder {...props} >
                <div className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left flex items-center border-teal-500 ">
                  
                  {/* <img
                    src="https://randomuser.me/api/portraits/women/71.jpg"
                    className="h-10 w-10 bg-white rounded-full border"
                    alt="..."
                  ></img> */}
               
                <span
                  className=
                    "ml-3 font-bold text-blueGray-600"                    
                >
                  {props.children}
                </span>
              </div>
            </components.Placeholder>);
  };
  const SingleValue=(props)=>{
    
   
      return (<components.SingleValue   {...props} >    
      <div className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left flex items-center border-teal-500 ">
      {props.data.value!="createchannel"&&props.data.value!="createpost"&&(
        <img
            src={`https://ipfs.io/ipfs/${props.data.icon}`}
          className="h-10 w-10 bg-white rounded-full border"
          alt="..."
        ></img>)}
  
      <span
        className=
          "ml-3 font-bold text-blueGray-600"                    
      >
      {props.children}
      </span>
      
    </div>
     
  </components.SingleValue  >);
  }


 
  
  async function createChannel(channelName){
    var content={name:channelName,
      description:"",
      topics:[],
      rules:[],      
      setting:{},
      appearance:{
                  iconImg_Url:'QmU6cH3ZUtbW474bQrCK7dXuEqxVnFQqXgnTjBRiMZgikN',
                  coverImg_Url:'',
                  themeColor:"#3423f2",
                  bannerColor:"#3423f2",
                  bannerHeight:64
                }
    }
    setSubmitting("uploadingToIpfs");
    var _contentUrl=await  jsonDataUploadtoIpfs(JSON.stringify(content))
    if(!_contentUrl){      
      ErrorToast("Error occurs in IPFS Uploading")
      setSubmitting("ready");
      return;

    }

    setSubmitting("channelcreateing");
    
    var res=await createCommunityChannel(chainId,MyBoardContract,account,channelName,_contentUrl,'QmU6cH3ZUtbW474bQrCK7dXuEqxVnFQqXgnTjBRiMZgikN')

    if(res=="success"){
      SuccessToast("New community channel was created successfully!")
    }else{
      ErrorToast("Community channel create failed!")

    }
    setSubmitting("ready");
    getDefaultOptions(setDefaultOptions)
  }
  

  return (
    <>
      {isOpenCreateChannelModal&&(<CreateChannelModal setIsOpen={setIsOpenCreateChannelModal} createChannel={createChannel}/>)}
      {submitting=="uploadingToIpfs"&& (
          <Loading title="uploadingToIpfs"/>
          ) }
      {submitting=="creating"&& (
          <Loading title="creating"/>
          ) }      
      {submitting=="channelcreateing"&& (
            <Loading title="Community Channel Creating"/>
          ) }
      {isOpenPostTypeModal&&(
        <PostTypeModal
          setIsOpenModal={setIsOpenPostTypeModal}
          postSort={"post"}
        />
      )}
      <div className="rounded-t  mb-0 px-6 " >         
        <div className="relative flex w-full flex-wrap items-stretch">
        
          <div style={{ margin: 5, width: 300 }}>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            isSearchable       
            defaultOptions={defaultOptions}
            onInputChange={handleInputChange}
            onChange={onSelectChannelChange}            
            placeholder="Select a Community Channel"
            defaultValue={null}
            
            styles={{
              value: (base) => ({
                ...base,
                border: '0px solid red',
                margin: 0,
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
              
                primary: 'white',
              },
            })}
            components={{ ClearIndicator,IndicatorSeparator,Option,Placeholder,SingleValue }}
        
          />
          </div>
          
        </div> 
      </div> 
              
    </>
  );
}
