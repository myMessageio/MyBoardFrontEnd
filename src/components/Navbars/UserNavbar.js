/*eslint-disable*/
import React, { useState,useEffect } from "react";
import { Link,  Outlet } from "react-router-dom";
import metamask from "../../assets/icons/metamask.svg";
// components

import SelectForm from "./SelectorForm";
///fontawesome
import {
  Popover,
  PopoverHandler,
  PopoverContent,

} from "@material-tailwind/react";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";



////redux
import logo from  "../../assets/image/logo.svg"
import { networkNames } from "../../Web3Api/env";



export default function  UserNavbar(
  { currentUserProfile,
    chainId,
    active,   
  connectWallet,
  disconnectWallet,
  account,
  setSelNetworks,selNetworks,
  setIsOpenSwitchNetworkModal
}
){
  const [navbarOpen, setNavbarOpen] = useState(false);
  useEffect(()=>{    

  },[account,active,chainId])
 
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    console.log(offset)
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  function selectNetwork(e,networkName){   
    sessionStorage.setItem(networkName,e.target.checked)
   
    const BscSelectState=sessionStorage.getItem("bsc")
    const PolygonSelectState=sessionStorage.getItem("polygon")
    const MoonbeamSelectState=sessionStorage.getItem("moonbeam")
    const TestBscSelectState=sessionStorage.getItem("testbsc")
    const MumbaiSelectState=sessionStorage.getItem("mumbai")
    const MbaseSelectState=sessionStorage.getItem("mbase")
    const newNetworks={"bsc":(BscSelectState=="true"),"polygon":PolygonSelectState=="true","moonbeam":MoonbeamSelectState=="true","testbsc":TestBscSelectState=="true","mumbai":MumbaiSelectState=="true","mbase":MbaseSelectState=="true"}
  
    setSelNetworks(newNetworks)

  }
  function connectToNetwork(){
    setIsOpenSwitchNetworkModal([true,false,'0'])
  }
 


 
  return (
    <>
      <nav className={"top-0 fixed  z-50 w-full flex flex-wrap items-center justify-between px-2 py-2 navbar-expand-lg shadow "
                
                + (offset > 50 ?"bg-white": "") }>
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block  whitespace-nowrap uppercase "
            >          
              <img
                src={logo}
                className="h-14 w-14 "                
              ></img> 
            </Link>
          
            {/* <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button> */}
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >    
    
            <SelectForm 
            account={account}
            chainId={chainId}                   
            active={active}
            selNetworks={selNetworks}
            setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}
            />       
              
           
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {/* <li className="flex items-center">
                <div className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
                  <div className="relative flex w-full flex-wrap items-stretch">
                    <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="address,name,ip"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                    />
                  </div>
                </div>
              </li> */}
              <li className="flex items-center">
                <Link
                  className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  to="/postlist"                
                >                  
                  <span className="lg inline-block ml-2">Posts</span>
                  </Link>
                  <Outlet />
              </li>
              {/* <li className="flex items-center">
              <Link
                  className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  to="/user/follows"
              
                >
                
                  <span className="lg inline-block ml-2">follows</span>
                  </Link>
              </li>
              <li className="flex items-center">
              <Link
                  className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  to="/user/followers"
              
                >
                
                  <span className="lg inline-block ml-2">follower</span>
                  </Link>
              </li> */}
              {/* <li className="flex items-center">
                <Link
                  className="hover:text-blueGray-500 text-blueGray-700  py-4 lg:py-2 flex items-center text-xl uppercase font-bold"
                  to="/user/notificationlist"
              
                >              
              
              </Link>
              </li> */}
              
              {/* {active && currentUserInf&& (
              <li className="flex items-center">
                <UserDropdown profileImage={`https://ipfs.ios/ipfs/${currentUserInf.profileImgUrl}`}
                              account={account}
                              disconnectWallet={disconnectWallet} />

                
              </li>   )}     */}




                <li className="flex items-center ">
                  <Popover placement="bottom">
                    <PopoverHandler>
                      <label  color="green">Networks</label>
                    </PopoverHandler>
                    <PopoverContent className="transition-none z-10">
                      
                      <div className="flex flex-col m-2 pl-3 pr-3 " >
                        <div>
                          <h6 className="mb-2 text-sm font-semibold tracking-tight text-gray-900 dark:text-white">Networks</h6>

                          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">Switch the data source for the interface.</p>
                        </div>

                        <div>
                          <div className="mb-2 block">
                            <label
                            
                              value="MainNet"
                              color={"text-white"}
                            />
                          </div>

                          <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                            
                              <input id="default-checkbox" type="checkbox"  className="w-4 h-4 text-blue-600 bg-gray-100 rounded no-border" 
                                onChange={(e)=>{selectNetwork(e,"bsc")}}
                                defaultChecked={selNetworks["bsc"]}/>                           
                              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">BSC</label>
                            </li>
                           
                            <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                              <input id="default-checkbox" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              onChange={(e)=>{selectNetwork(e,"moonbeam")}}
                              defaultChecked={selNetworks["moonbeam"]}/>
                              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Moonbeam</label>
                            </li>
                            {/* <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                              <input id="default-checkbox" type="checkbox"  className="w-4 h-4 text-blue-600 bg-gray-100 rounded  focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              onChange={(e)=>{selectNetwork(e,"polygon")}}
                              defaultChecked={selNetworks["polygon"]}/>
                              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Polygon</label>
                            </li>                           */}
                          </ul>
                        </div>
                        {/* <div className="mt-2 block">
                          <div className="mb-2 block">
                            <label
                              
                              value="TestNet"
                              color={"text-white"}
                            />
                          </div>

                          <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                              <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              onChange={(e)=>{selectNetwork(e,"testbsc")}}
                              defaultChecked={selNetworks["testbsc"]}/>
                              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">TestBSC</label>
                            </li>
                            <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                              <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              onChange={(e)=>{selectNetwork(e,"mumbai")}}
                              defaultChecked={selNetworks["mumbai"]}/>
                              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mumbai</label>
                            </li>
                            <li className="py-2 px-4 w-full border-b border-gray-200 dark:border-gray-600">
                              <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              onChange={(e)=>{selectNetwork(e,"mbase")}}
                              defaultChecked={selNetworks["mbase"]}/>
                              <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mbase</label>
                            </li>
                    
                          </ul>
                        </div> */}
                      </div>
                    </PopoverContent>
                  </Popover>
                </li>  
                
                {!window.ethereum?(
                  <>  
                  <li className="flex items-center">
                    <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank"
                    className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 ml-2 ">
                          <img src={metamask}  className="me-2 w-6 h-6 mr-2" alt="casperpad" />
                    Install MetaMask
                    </a>
                  </li>
                
                </>):(<>
                  {account?
                    (<>
                      <li className="flex items-center  ml-8">
                        <Menu placement="bottom-start">
                          <MenuHandler>
                            <div className="items-center flex">
                              <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full mr-2">
                                {currentUserProfile? (<img
                                  alt="..."
                                  className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg "
                                  src={`https://ipfs.io/ipfs/${currentUserProfile.profileImgUrl}`} 
                                />):(
                                  <img
                                  alt="..."
                                  className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                                  src={`https://ipfs.io/ipfs/bafkreieyptduhrus2inmamc3mi4sbqvqddz65ve6itcmlncylj6upmz5ke`} 
                                />
                                )}
                            
                              </span>
                              {account.substring(0,6)+"..."+account.substring(38)}({networkNames[chainId]})
                            </div>
                            {/* <Button>{account.subString(0,6)+"..."+account.subString(38)}</Button> */}
                          </MenuHandler>
                          <MenuList>
                            <MenuItem>
                              <Link to="/signup" >
                                  profile setting
                              </Link>
                            </MenuItem>
                            {account=='0xD394C0F9E07bcE136C5B9CC151b28E32011F62E5'&&(
                              <MenuItem>
                              <Link to="/admin" >
                                  admin
                              </Link>
                            </MenuItem>
                            )}
                            <MenuItem><Link to={`/user/${account}/overview`}>your post</Link></MenuItem>     
                            <MenuItem onClick={()=>{ setIsOpenSwitchNetworkModal([true,false,'0'])}}>Switch Network</MenuItem>                       
                            <MenuItem  onClick={disconnectWallet}>logout </MenuItem>
                          </MenuList>
                        </Menu>                  
                      </li>
                    </>):
                    (<>
                        <li className="flex items-center  ml-8">
                          <button onClick={connectToNetwork}>Connect</button>                                          
                        </li>
                    </>)

                  }       
                  
                  </>)} 
                
            </ul>
            
           

          </div>
        </div>
      
      </nav>
    
    </>
  );
}


 

