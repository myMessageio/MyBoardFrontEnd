import React,{useEffect, useState} from "react";
import '../../components/ImageUploadSingle/App.css';

import { toast } from 'react-toastify';
import {useNavigate} from "react-router-dom"

import ImageUploader from "../../components/ImageUpload/index.js";
import  Loading from "../../components/Loading/loading"

import {imageUploadtoIpfs } from "../../ipfs/ipfs"
import {getWriteContract,userProfileUpdate} from "../../Web3Api/Web3"

export default function ProfileSetting({account,getCurrentUserProfile,chainId,active}) {
  /////////variable for signup  
    const [username,setUserName]=useState('');///username
   
    const [profileImg,setProfileImg]=useState(null);///profileimage   
    const [submitting, setSubmtting]=useState("ready")//////submitting state
  
    const navigate = useNavigate() //////////router change history
    const myboardContract=getWriteContract(chainId,account,active,"myboard")  
 
  //////////////////////submit action
  async function onSubmit(e){
    e.preventDefault();    
    if(profileImg==null){
      console.log(profileImg)
      setSubmtting("ready")
      toast.error("profile Image Upload Error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        Transition:"flip"
        });
        return;
    }   
    setSubmtting("uploading")
    var profileImgUrl=await imageUploadtoIpfs(profileImg);   
    if(!profileImgUrl){
      toast.error("Ipfs uploading Error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        Transition:"flip"
      });
      setSubmtting("ready")
      return
    }  
   
    setSubmtting("submitting") ;
    console.log(account,username,profileImgUrl)
    
    var res=await userProfileUpdate(chainId, myboardContract,account,username,profileImgUrl);


    if(res=="success"){
        toast.success('Your profile is updated Successfully!',{ 
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });       
        getCurrentUserProfile()
        navigate('/postlist')
    }else{
        toast.error("Failed in your profile updating!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            Transition:"flip"
          });

    }
    setSubmtting("ready")


  }

  
  return (
    <>
       {submitting=="submitting"&& (
           <Loading title="submitting"/>
        ) }
      {submitting=="uploading"&& (
          <Loading title="uploading To IPFS"/>
      ) }
     
      <div className="container mx-auto px-4 h-full pt-10">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
         
      
              <div className="rounded-t bg-green-600 mb-0 px-6 py-4">
                <div className="text-center flex justify-between">
                  <h6 className="text-white text-xl font-bold">Signup</h6>
                  
                </div>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={onSubmit}>
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    User Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="lucky.jesse" required
                          value={username}
                          onChange={(e)=>setUserName(e.target.value)}
                        />
                      </div>
                    </div>
                   
                  </div>


                  <hr className="mt-6 border-b-1 border-blueGray-300" />
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                   Photo
                  </h6>
                  <div className="flex flex-wrap">
            
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                           Select your Photo
                        </label>
                        <ImageUploader style={{ maxWidth: '100%', margin: "10px auto" }}
                               withPreview={true} 
                               singleImage={true}
                               setImage={setProfileImg}
                               />
                      </div>
                      
                    </div>
               
                  </div>
               

                  <hr className="mt-6 border-b-1 border-blueGray-300" />

                 

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>

            
                </form>
              </div>
      
            </div>
          </div>
        </div>

        
      </div>

    </>
  );
}
