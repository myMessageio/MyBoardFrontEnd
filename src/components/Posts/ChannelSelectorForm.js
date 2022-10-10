import React, {useState }  from "react";

import '../../assets/styles/selectsearch.css';

import  { components } from 'react-select'
import AsyncSelect from 'react-select/async';
import { contractAddresses,networkNames } from "../../Web3Api/env";
import { backendPostRequest } from "../../axios/backendRequest";
export default function PostCreate(
  {getDefaultOptions,setIsOpenCreateChannelModal,setSelectChannelID,selectChannelID,defaultOptions,
    setIsOpenSwitchNetworkModal,
    active,
    account,
    chainId}
) {
  ////



 
  //////variable for posting
 

  function onSelectChannelChange(e,t){
   
    if(e){

      if(e.value==-1){      
          setIsOpenCreateChannelModal(true);
        return
      }
      setSelectChannelID(e.value)

    }
  }
  const [inputValue,setInputValue]=useState("")
  const handleInputChange = (newValue,t) => {   
    const inputValue = newValue.replace(/\W/g, '');   
    setInputValue(inputValue);
    return inputValue;
  };
  const loadOptions = (
    inputValue,
    callback,
  ) => {  
    filterOption(inputValue,callback);  

  };

  function onFocusSetting(){
    if(active&&account){
    
     
    }else{
     setIsOpenSwitchNetworkModal([true,false,'0']);
     return
    }
  
  }
  function filterOption(keyword,callback){
    console.log(keyword)
  
    if(keyword==''){
      
      getDefaultOptions(callback)
    }else{ 
      
      var networkName=networkNames[chainId.toString()]
      var contractaddress=contractAddresses[networkName]["myboard"]  

      let formData = new FormData();        

      formData.append("selnetworksstr", networkName);
      formData.append("selcontractaddrstr", contractaddress);
      formData.append("keyword", keyword);      
     
      backendPostRequest("channel/findforpost", formData).then(function(results){       
        console.log(results)

        var opt1=[]
        for(let res of results.data.channels){ 
          opt1.push({label:res.channelName ,value:res.channelId,color: '#0052CC',icon:res.iconImgUrl})
    
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
        <div className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left flex items-center border-teal-500 ">
        {props.data.value!=-1&&(
        <img
          src={`https://ipfs.io/ipfs/${props.data.icon}`}
          className="h-10 w-10 bg-white rounded-full border"
          alt="..."
        ></img>
        )}
        <span
          className=
            "ml-3 font-bold text-blueGray-600"                    
        >
          {props.data.label}
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
      {props.data.value!=-1&&(
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
  


  return (
    <>

        <div className="rounded-t bg-white mb-0 px-6 py-3 mb-2 mt-2" >         
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
              defaultValue={selectChannelID}
              onFocus={onFocusSetting}
              
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,               
                  primary: 'rightgreen',
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
