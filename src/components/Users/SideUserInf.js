import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../Web3Api/Web3";
import { backendPostRequest } from "../../axios/backendRequest";
import { contractAddresses } from "../../Web3Api/env";
export default function SideUserInf({seluseraccount,
}) {
  const [selUserProfile,setSelUserProfile]=useState(null)
  const [[postcal,channelcal,commentcal,postawardedCal,commentawardedCal],setUserCal]=useState([null,null,null,null,null]);
  const [copyItemName,setCopyItemName]=useState("");
  useEffect(()=>{
    getProfile()
    getUserInf()
  },[])
  useEffect(()=>{
   
  },
  [selUserProfile,postcal,copyItemName])
  
  
  async function getProfile(){
    var userInf=await getUserProfile(seluseraccount);
    setSelUserProfile(userInf);
  }

  async function getUserInf(){
    let formData = new FormData();  
    // var selnetworkNames=["bsc","testbsc","mbase","moonbeam","polygon","mumbai"]
    var selnetworkNames=["bsc","moonbeam"]
    var selcontractaddresses=[]
    selnetworkNames.map(( key )=> { 
        selcontractaddresses.push(contractAddresses[key]['myboard'])
    }  )
  
    
    var selnetworksstr=selnetworkNames.toString()
    var selcontractaddrstr=selcontractaddresses.toString()

    formData.append("selnetworksstr", selnetworksstr);
    formData.append("selcontractaddrstr", selcontractaddrstr);
    formData.append("account", seluseraccount);    
    var res=await backendPostRequest("user/statistcs", formData);

    if(res.data)
    setUserCal([res.data.posts,res.data.channels,res.data.comments,res.data.postawarded,res.data.commentawarded])

  }

  return (
    <>
     
    
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="relative">
                    {selUserProfile? (
                        <img
                        alt="..."
                        src={`https://ipfs.io/ipfs/${selUserProfile.profileImgUrl}`} 
                        style={{width:150,height:150}}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px "
                      />

                    ):(
                                    <img
                        alt="..."
                        src={`https://ipfs.io/ipfs/bafkreieyptduhrus2inmamc3mi4sbqvqddz65ve6itcmlncylj6upmz5ke`} 
                        style={{width:150,height:150}}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px "
                      />

                    
                    )}
                </div>
              </div>
              <div className="w-full px-4 text-center mt-20">
                <div className="text-center mt-6">
                 
                  <h3 className="text-xl font-semibold leading-normal mb-1 text-blueGray-700 ">
                    {selUserProfile?(<>{selUserProfile.username}</>):
                    (<>{undefined}</>)}
                  </h3>
                  <h3 className="text-xl font-semibold leading-normal mb-1 text-blueGray-700 " onClick={()=>{
                    navigator.clipboard.writeText(seluseraccount);
                  }}>                      
                     {seluseraccount.substring(0, 6)+"..."+seluseraccount.substring(38)}
                     {" "}
                <button onClick={()=>{navigator.clipboard.writeText(seluseraccount);
                            setCopyItemName("creator")}}><i className={copyItemName!="creator"?("far fa-copy"):("fas fa-copy")}></i></button>
                
                  </h3>
          
                
                  
                       
                </div>
              </div>
              
            
            </div>
            <div className="w-full px-4 text-center mt-2 border-t">
              <h3 className="text-xl font-semibold leading-normal uppercase mb-1 text-blueGray-700 pt-8">                     
                   Channels:{channelcal?(<>{channelcal.totalchannels}</>):(<>0</>)}
                  
              </h3>
              <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {channelcal?(<>{channelcal.bscchannels}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">BSC</span>
                </div>
                {/* <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {channelcal?(<>{channelcal.polygonchannels}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Polygon</span>
                </div> */}
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {channelcal?(<>{channelcal.moonbeamchannels}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Moonbeam</span>
                </div>
              </div>
              {/* <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 {channelcal?(<>{channelcal.testbscchannels}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">TESTBSC</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  {channelcal?(<>{channelcal.mumbaichannels}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mumbai</span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 {channelcal?(<>{channelcal.mbasechannels}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mbase</span>
                </div>
              </div> */}
            </div>
            <div className="w-full px-4 text-center mt-2 border-t">
              <h3 className="text-xl font-semibold leading-normal uppercase mb-1 text-blueGray-700 pt-8">                     
                   posts: {postcal?(<>{postcal.totalposts}</>):(<>0</>)}
                  
              </h3>
              <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                
                  {postcal?(<>{postcal.publicposts}</>):(<> 0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">public</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
               
                  {postcal?(<>{postcal.privateposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">private</span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {postcal?(<>{postcal.paidposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">paid</span>
                </div>
              </div>
              <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {postcal?(<>{postcal.bscposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">BSC</span>
                </div>
                {/* <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {postcal?(<>{postcal.polygonposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Polygon</span>
                </div> */}
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {postcal?(<>{postcal.moonbeamposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Moonbeam</span>
                </div>
              </div>
              {/* <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                
                  {postcal?(<>{postcal.testbscposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">TESTBSC</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                
                  {postcal?(<>{postcal.mumbaiposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mumbai</span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                  
                  {postcal?(<>{postcal.mbaseposts}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mbase</span>
                </div>
              </div> */}
            </div>
            <div className="w-full px-4 text-center mt-2 border-t">
              <h3 className="text-xl font-semibold leading-normal uppercase mb-1 text-blueGray-700 pt-8">                     
                   comments:{commentcal?(<>{commentcal.totalcomments}</>):(<>0</>)}
                  
              </h3>             
            </div>
            <div className="w-full px-4 text-center mt-2 border-t">
              <h3 className="text-xl font-semibold leading-normal uppercase mb-1 text-blueGray-700 pt-8">                     
                   awarded post:{postawardedCal?(<>{postawardedCal.totalpostawarded}</>):(<>0</>)}
                  
              </h3>
              <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">                
                  {postawardedCal?(<>{postawardedCal.bscawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">BSC</span>
                </div>
                {/* <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
        
                  {postawardedCal?(<>{postawardedCal.polygonawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Polygon</span>
                </div> */}
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">

                  {postawardedCal?(<>{postawardedCal.moonbeamawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Moonbeam</span>
                </div>
              </div>
              {/* <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                
                  {postawardedCal?(<>{postawardedCal.testbscawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">TESTBSC</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {postawardedCal?(<>{postawardedCal.mumbaiawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mumbai</span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
             
                  {postawardedCal?(<>{postawardedCal.mbaseawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mbase</span>
                </div>
              </div> */}
            </div>
            <div className="w-full px-4 text-center mt-2 border-t">
              <h3 className="text-xl font-semibold leading-normal uppercase mb-1 text-blueGray-700 pt-8">                     
                   awarded comments:{commentawardedCal?(<>{commentawardedCal.totalcommentawarded}</>):(<>0</>)}
                  
              </h3>
              <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">                 
                  {commentawardedCal?(<>{commentawardedCal.bscawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">BSC</span>
                </div>
                {/* <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {commentawardedCal?(<>{commentawardedCal.polygonawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Polygon</span>
                </div> */}
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {commentawardedCal?(<>{commentawardedCal.moonbeamawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Moonbeam</span>
                </div>
              </div>
              {/* <div className="flex justify-center py-2  pt-2 ">               
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                
                  {commentawardedCal?(<>{commentawardedCal.testbscawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">TESTBSC</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                 
                  {commentawardedCal?(<>{commentawardedCal.mumbaiawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mumbai</span>
                </div>
                <div className="lg:mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                
                  {commentawardedCal?(<>{commentawardedCal.mbaseawarded}</>):(<>0</>)}
                  </span>
                  <span className="text-sm text-blueGray-400 uppercase">Mbase</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
     
    </>
  );
}
