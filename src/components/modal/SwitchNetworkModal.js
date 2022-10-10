import React from 'react';
import { networkNames,networkChainIds } from '../../Web3Api/env';


const SwitchNetworkModal = ({setIsOpen, postSort,switchNetwork,connectWallet,account, active, chainId,singleSelect, selectchainId}) => {  
    // useEffect(()=>{
    //     console.log(singleSelect, selectchainId)
    // },[singleSelect, selectchainId])
   
    function selectNetwork(selectchainId){
        sessionStorage.setItem("defaultChainId",selectchainId)
      setIsOpen([false,false,'0']);
      if(!account){
        connectWallet(selectchainId)
        
      }else{
       switchNetwork(selectchainId)
      }

    }
  
    return (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-100 outline-none focus:outline-none"
          
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ">
                {/*header*/}
                <div className="flex justify-between items-center py-4 px-6 rounded-t border-b dark:border-gray-600 ">
                    <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                        Select Network 
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="walletModal"
                    onClick={()=>{setIsOpen([false,false,'0'])}}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400"> Select one of the following networks.</p>
                    {singleSelect?(
                         <ul className="my-4 space-y-3">
                         <li key="1">
                             <button  
                             onClick={()=>{selectNetwork(selectchainId);}}
                             className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                 
                                 <span className="flex-1 ml-3 whitespace-nowrap letter-upper">{networkNames[selectchainId]}</span>
                                
                             </button>
                         </li>

                   
                        
                       
                     </ul>
                    ):(
                    <ul className="my-4 space-y-3">
                        

                        <li key="1">
                            <button  
                            onClick={()=>{selectNetwork(networkChainIds["bsc"]);}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">BSC</span>
                               
                            </button>
                        </li>
                        <li key="2">
                            <button  
                            onClick={()=>{selectNetwork(networkChainIds["moonbeam"]);}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">Moonbeam</span>
                               
                            </button>
                        </li>
                        {/* <li key="3">
                            <button  
                            onClick={()=>{selectNetwork(networkChainIds["polygon"]);}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">Polygon</span>
                            
                            </button>
                        </li>
                        <li key="4">
                            <button  
                            onClick={()=>{selectNetwork(networkChainIds["testbsc"]);}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">TestBSC</span>
                               
                            </button>
                        </li>
                        <li key="5">
                            <button  
                            onClick={()=>{selectNetwork(networkChainIds["mbase"]);}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">MBase</span>
                               
                            </button>
                        </li>
                        <li key="6">
                            <button  
                            onClick={()=>{selectNetwork(networkChainIds["mumbai"]);}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">Mumbai</span>
                               
                            </button>
                        </li>
                   */}
                       
                      
                    </ul>
                    )}
                   
                    {/* <div>
                        <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                            
                            Why do I need to connect with my wallet?</a>
                    </div> */}
                </div>
               
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-99 bg-black" ></div>
          
        </>
    
    );
  }
  
  export default SwitchNetworkModal;

