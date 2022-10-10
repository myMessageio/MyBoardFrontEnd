import React,  { useEffect,useState } from "react";
import { Routes, Route, Navigate  } from "react-router-dom";
// components

import UserNavbar from "../components/Navbars/UserNavbar.js";
//views
import PostListView from "../views/user/PostListView.js";
import PostDetailView from "../views/user/PostDetailView.js";
import PostCreateView from "../views/user/PostCreateView.js";
import ChannelPostsView from "../views/user/ChannelPostsView.js";
import ChannelOwnerView from "../views/user/ChannelOwnerView.js"
import ChannelListView from "../views/user/ChannelListView"

import UserDetailInfView from "../views/user/UserDetailInfView.js";
import ProfileSetting from "../views/signup/ProfileSetting.js";

import { ToastContainer } from 'react-toastify';
import SwitchNetworkModal from "../components/modal/SwitchNetworkModal.js";


///////////////////////////////////////

import { useWeb3React } from "@web3-react/core"
import { injected } from "../InjectConnector"
import Web3 from 'web3'
import { getUserProfile } from "../Web3Api/Web3.js";
import { importNetworksParams, networkNames } from "../Web3Api/env.js";
import Dashboard from "../views/admin/Dashboard"
export default function Landing() {
  
  

 
  ///////////////////////////////////////////////////////////////
  const { active, account, activate, deactivate,chainId } = useWeb3React()
  const web3 = new Web3(window.ethereum);
  const [currentUserProfile,setCurrentUserProfile]=useState(null)
  // const [currentUserInf,setCurrentUserInf]=useState(null)

  const [activating,setActivating]=useState(false)
  const [selNetworks,setSelNetworks]=useState({"bsc":false,"polygon":false,"moonbeam":false,"testbsc":false,"mumbai":false,"mbase":false})
  const [[isOpenSwitchNetworkModal,singleSelect,selectchainId],setIsOpenSwitchNetworkModal]=useState([false,false,'0']) 

  useEffect(()=>{
      const defaultChainId=sessionStorage.getItem("defaultChainId")
      if(defaultChainId){

        connectWallet(defaultChainId)
      }else{

      }
      
      initailSessionSetting()
      getCurrentUserProfile()
     }, [ ])

  useEffect(()=>{ 
  },[selNetworks])
  useEffect(()=>{  
    if(account){
      getCurrentUserProfile()       
    }     
  }, [active,account,chainId])
  //////

  useEffect(()=>{},[isOpenSwitchNetworkModal,singleSelect,selectchainId])


  function initailSessionSetting(){   

    const BscSelectState=sessionStorage.getItem("bsc")
    const PolygonSelectState=sessionStorage.getItem("polygon")
    const MoonbeamSelectState=sessionStorage.getItem("moonbeam")
    const TestBscSelectState=sessionStorage.getItem("testbsc")
    const MumbaiSelectState=sessionStorage.getItem("mumbai")
    const MbaseSelectState=sessionStorage.getItem("mbase")
  
    if(BscSelectState==undefined||PolygonSelectState==undefined||MoonbeamSelectState==undefined||TestBscSelectState==undefined
      ||MumbaiSelectState==undefined||MbaseSelectState==undefined){     
      // sessionStorage.setItem("bsc",true)    
      // sessionStorage.setItem("moonbeam",true)
      // sessionStorage.setItem("polygon",true)
      // sessionStorage.setItem("testbsc",true)
      // sessionStorage.setItem("mumbai",true)
      // sessionStorage.setItem("mbase",true)
      sessionStorage.setItem("bsc",true)    
      sessionStorage.setItem("moonbeam",true)
      sessionStorage.setItem("polygon",false)
      sessionStorage.setItem("testbsc",false)
      sessionStorage.setItem("mumbai",false)
      sessionStorage.setItem("mbase",false)

      // setSelNetworks({"bsc":true,"polygon":true,"moonbeam":true,"testbsc":true,"mumbai":true,"mbase":true})
      setSelNetworks({"bsc":true,"polygon":false,"moonbeam":true,"testbsc":false,"mumbai":false,"mbase":false})
    }else{
      // const xx={"bsc":(BscSelectState=="true"),"polygon":PolygonSelectState=="true","moonbeam":MoonbeamSelectState=="true","testbsc":TestBscSelectState=="true","mumbai":MumbaiSelectState=="true","mbase":MbaseSelectState=="true"}
      const xx={"bsc":(BscSelectState=="true"),"polygon":false,"moonbeam":MoonbeamSelectState=="true","testbsc":false,"mumbai":false,"mbase":false}

      setSelNetworks(xx)

    }
    

  }

  ///////
  async function getNetworkId(){
    const currentChainId = await web3.eth.net.getId()
    return currentChainId
  }
  async function  switchNetwork(selchainId){
   
    // await window.ethereum.enable()
    const currentChainId = await getNetworkId()
    
    if (currentChainId != selchainId) {
      try {
        await web3.currentProvider.request({
          method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(selchainId) }],
          });
        setActivating(false)
      } catch (switchError) {
      
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code == 4902) {
    
          var importparam=importNetworksParams[ networkNames[selchainId]]         
          try {
            await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    importparam
                      ],
                  });
            connectWallet(selchainId)
          } catch (error) {           
            alert("error adding new network: ");
          }
         
        }
      }
    }
  }
  //////////
  async function connectWallet(selchainId){    
   
    try {
      setActivating(true)
      await activate(injected)
      if(!active){   
        switchNetwork(selchainId)
      }else{
        setActivating(false)
      }
    
    } catch (ex) {
      
      console.log(ex)
    }
  }
  async function disconnectWallet(){    
    try {
      deactivate()
      localStorage. removeItem('defaultChainId');

    } catch (ex) {
      console.log(ex)
    }   
  }
  //////////////////

  async function getCurrentUserProfile(){     
    var userprofile=await getUserProfile(account);       
    setCurrentUserProfile(userprofile);

  

  }
  ////////renderRoute
  const renderRouter=()=>{
   
   
    return(
      <Routes>
        <Route path="/" 
                exact element={<PostListView  account={account}  currentUserProfile={currentUserProfile}  active={active}  chainId={chainId} selNetworks={selNetworks} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} 
        />

        <Route path="/postlist" 
                exact element={<PostListView  account={account} currentUserProfile={currentUserProfile} active={active}  chainId={chainId} selNetworks={selNetworks} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} 
        />
        {/* <Route path="/postcreate/:postType" 
            exact element={ <PostCreateView  account={account} currentUserProfile={currentUserProfile}   active={active} chainId={chainId} 
            setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
        />} />  */}
        <Route path="/postcreate" 
            exact element={ <PostCreateView  account={account} currentUserProfile={currentUserProfile}   active={active} chainId={chainId} 
            setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
        />} />  
        <Route path="/postdetail/:did"
          exact element={ <PostDetailView account={account} currentUserProfile={currentUserProfile}  active={active}  chainId={chainId} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} 
        />
        <Route path="/channel/:channeldid/posts"
          exact element={ <ChannelPostsView account={account}  active={active}  chainId={chainId} currentUserProfile={currentUserProfile} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} 
        />
        <Route path="/channel/:channeldid/owner/*"
          exact element={ <ChannelOwnerView  account={account}   active={active}  chainId={chainId} currentUserProfile={currentUserProfile} setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}/>} 
        />
         <Route path="/user/:seluser/*" 
          exact element={<UserDetailInfView account={account}  active={active}  chainId={chainId}  setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal} selNetworks={selNetworks}/>} />
        <Route path="/channel/list/:topic"
          exact element={ <ChannelListView  account={account}  active={active}  chainId={chainId}  setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal} selNetworks={selNetworks}/>}/> 
   
        <Route path="/signup" exact element={<ProfileSetting account={account} chainId={chainId}  getCurrentUserProfile={getCurrentUserProfile} active={active}/>} />
        <Route path="/admin" exact element={<Dashboard />} />
     
        <Route path="*"  element={<Navigate replace to="/" />} />
        
        
      </Routes>)

     
    
  }

  


  
  return (
    <>
       {isOpenSwitchNetworkModal&&(<SwitchNetworkModal setIsOpen={setIsOpenSwitchNetworkModal}
                                      singleSelect={singleSelect} selectchainId={selectchainId} 
                                      switchNetwork={switchNetwork} connectWallet={connectWallet}
                                  account={account} active={active} chainId={chainId} />)}
      <UserNavbar         
        active={active}
        chainId={chainId}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        account={account}
        currentUserProfile={currentUserProfile}
        selNetworks={selNetworks} 
        setSelNetworks={setSelNetworks} 
        setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}

        fixed />
      <div className="relative mt-20"
        // style={{  backgroundImage: 'url(' + background + ')'
        //         //"url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80')"
        //         }}
                >
        <div className=" mx-auto w-full ">
        {/* <div className="px-4 md:px-10 mx-auto w-full "> */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          /> 

        {renderRouter()}
        </div>
      </div>    
    

    
  
      {/* <Footer /> */}
    </>
  );
}
