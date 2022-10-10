import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading/loading" ;
import {getWriteContract,
  getChannelInf,
joinChannel} from "../../Web3Api/Web3"
import { ErrorToast,SuccessToast } from "../toast/toast";
import { backendPostRequest } from "../../axios/backendRequest";
import { contractAddresses,chainScanUrls } from "../../Web3Api/env";
import SearchBox from "../Posts/SearchBox";
export default function UserChannels({seluser, 
  active ,account,chainId,setIsOpenSwitchNetworkModal,selNetworks
                                                   
}) {
 
  const MyBoardContract=getWriteContract(chainId,account,active,"myboard")
  const [filterchannels,setfilterChannels]=useState([]);

  const [submitting,setSubmitting]=useState('ready')
  const [searchtext,setSearchText]=useState("");
  useEffect(()=>{  
    if(seluser)
    getChannelData(true)
    
  },[active,account,seluser,selNetworks])
  useEffect(()=>{

  },[filterchannels])

  async function getChannelData(newselect,searchkey ){ 
    var offset=0;
   
    if(!newselect &&filterchannels.length>0){
      offset=filterchannels.length;
    } 

    let formData = new FormData();  
    var selnetworkNames=[]
    var selcontractaddresses=[]
    for (let key in selNetworks) {
      if(selNetworks[key]){
        selnetworkNames.push(key);
        selcontractaddresses.push(contractAddresses[key]['myboard'])
      }
    }  

  
    if(selnetworkNames.length==0){
      setfilterChannels([])
      return  
    }
     
     var selnetworksstr=selnetworkNames.toString()
     var selcontractaddrstr=selcontractaddresses.toString()
   
 
     formData.append("selnetworksstr", selnetworksstr);
     formData.append("selcontractaddrstr", selcontractaddrstr);  
     formData.append("creator",seluser)    
     formData.append("offset", offset); 
     if(searchkey||searchkey==''){   
      setSearchText(searchkey)
      formData.append("searchkey", searchkey);
    }else{   
      formData.append("searchkey", searchtext);
    }
     var res= await backendPostRequest("channel/filterbyuser", formData);
     console.log(res)
     if(res.status==200){
      
      if(res.data.channels){
        var popularchannels=[]
        for(let channel of res.data.channels ){
          var res1=await getChannelInf(account,channel.channelId,channel.network)
          res1.chainId=channel.chainId;
          res1.did=channel.did;
          res1.network=channel.network;
          res1.transactionHash=channel.transactionHash;
          
          if(res1){
            popularchannels.push(res1)
          }
        }

        if(newselect){
          setfilterChannels(popularchannels)
        }else{       
          var newchannels=filterchannels.concat(popularchannels)           
          setfilterChannels(newchannels) 
        }  
     
      }
     } 

  }


 //////channelJoin
 async function joinCommuntyChannel(index){
  if(!account||!active||filterchannels[index].chainId!=chainId){
    setIsOpenSwitchNetworkModal([true,true,filterchannels[index].chainId.toString()]);
    return
  }
  if(filterchannels[index].joined)
    setSubmitting("joiningout")
  else
    setSubmitting("joining")
  
  var res = await joinChannel(chainId,MyBoardContract, account,filterchannels[index].channelId )
  if(res=="success"){
    if(filterchannels[index].joined)
    SuccessToast("Joined out successfully")
    else{
      SuccessToast("Joined successfully")
    }
    let _channels=filterchannels;
    _channels[index].joined=!filterchannels[index].joined;
    setfilterChannels(_channels)
    
  }
  else{
    if(filterchannels[index].joined)
    ErrorToast("Join out Failed")
    else
    ErrorToast("Join Failed")
  }
  setSubmitting("ready")

}
function showMore(){
  getChannelData(false )
}



  return (
    <>
     {submitting=="joining"&& (
        <Loading title="Joining..."/>
        ) }
        {submitting=="joiningout"&& (
        <Loading title="Joining out"/>
        ) }
        
        <div className="relative overflow-x-auto shadow-md  mt-10">
          <table className="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-white  bg-indigo-500 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" colSpan="2" className="px-6 py-3">
                          Communities
                      </th>
                      <th scope="col" className="px-2 py-3 text-center">
                          Tx_id
                      </th>
                      
                      <th scope="col" className="px-2 py-3 text-center">
                          Posts
                      </th>
                      <th scope="col" className="px-2 py-3 text-center">
                          Members
                      </th>
                      <th scope="col" className="px-2 py-3 text-center">
                          <span className="sr-only">Edit</span>
                      </th>
                      
                  </tr>
              </thead>
              <tbody>
      
                  {filterchannels.map((channel,i)=>{
                    return(
                      <>
                  
                      <tr className="py-4 border-b border-gray-400 pb-2 " key={"channel"+i}>
                        <td className="w-12 text-center">{i+1}</td>
                        <td>
                          <Link to={`/channel/${channel.did}/posts`} 
                            className="w-full  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap  text-left flex items-center mb-2 mt-2">
                            <span className="w-12 h-12 text-xl text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full"
                              style={{backgroundColor:'blue'}}>
                            
                              <img
                                  src={`https://ipfs.io/ipfs/${channel.iconImgUrl}`}
                                  // className="h-12 w-12 bg-white rounded-full border"
                                  className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                                  alt="..."
                                ></img>
                          
                            </span>
                            <span className="ml-3 font-bold text-blueGray-600 text-sm ">
                              {channel.name.substring(0,17)}
                              {channel.name.length>18&&<>...</>}({channel.network})
                            </span>
                          </Link>
                        </td>
                        <td className="text-center">
                          <a href={`${chainScanUrls[channel.network]}/tx/${channel.transactionHash}`} target="_blank" >
                             {channel.transactionHash.substring(0,6)+"..."+channel.transactionHash.substring(60)}
                          </a>
                        
                        </td>
                        <td className="text-center">
                          {channel.postcount}
                        </td>
                       
                        <td className="text-center">
                          {channel.joincount}
                        </td>
                        <td className="">
                          <div className="ml-4  text-left flex items-center ">
                              {account&&(<>
                                {channel.joined?
                                (<button className="text-lightBlue-500 bg-transparent border border-solid border-lightBlue-500 hover:bg-lightBlue-500 hover:text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
                                  onClick={()=>joinCommuntyChannel(i)}
                                >
                                  joined
                                </button>
                                ) :
                                ( <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-1 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150" 
                                onClick={()=>joinCommuntyChannel(i)}>
                                  Join
                                </button>)}
                              </>)}
                              
                          </div>
                        </td>
                      </tr>
                      </>
                    )
                    })
                  }
              </tbody>
          </table>
        </div>
        <div className="flex flex-wrap justify-center mt-12">
          <button className="text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
               onClick={showMore}
               >
            show more
          </button>
         
        </div>  
       
  

     
    </>
  );
}
