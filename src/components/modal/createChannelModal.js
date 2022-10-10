import React, { useState } from 'react';


const MyModal = ({setIsOpen,createChannel }) => {
  const [name,setname]=useState("");  
  const [enableLetterNumber,setEnableLetterNumber]=useState(50)
    function payTosubmit(){
      setIsOpen(false) 
      createChannel(name)   
    }  
    return (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-4"          
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <form onSubmit={()=>payTosubmit()}>
                <div className="flex items-start justify-between pl-8 pr-20 pb-4 pt-4 border-b border-solid border-blueGray-200 rounded-t bg-green-600">
               
                  <h5 className="text-2xl font-semibold text-white">
                       Create a Community Channel
                  </h5>
                 
                </div>
                
                
          
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t" >
                
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="form-group mb-6">
                      <label htmlFor="exampleInputEmail1" className="form-label inline-block mb-1 text-gray-700 font-semibold">Coummunity Channel Name</label>
                     
                      <input type="text" className="form-control  block  mt-4 w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding
                        border border-solid border-gray-300 rounded transition ease-in-out m-0focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                        onChange={(e)=>{setname(e.target.value.toString().substring(0,49));
                          setEnableLetterNumber(50-e.target.value.length); }}
                          value={name}
                        required                    
                        aria-describedby="emailHelp" placeholder="Wirte a name..."/>
                      
                    </div>
                    <small id="emailHelp" className="block mt-1 text-xs text-gray-600">{enableLetterNumber} Charactores remaining</small>
                    <small id="emailHelp" className="block mt-1 text-xs text-gray-600">Community names cannot be changed.</small>
                    
                  </div>
                  {/* <div data-bs-dismiss="modal" id="wallet-connect-binance chain wallet" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer" onClick={ handleConnectWallet }>
                      <div className="text-white mr-auto"> Binance Chain Wallet</div>
                      <img src={binance} className="me-2" alt="casperpad" />
                  </div>
                  <div data-bs-dismiss="modal" id="wallet-connect-binance chain wallet" className="c-list border-b px-3 py-2 d-flex align-items-center cursor-pointer" onClick={ handleConnectWallet }>
                      <div className="text-white mr-auto"> Trust Wallet</div>
                      <img src={trust} className="me-2 trustwallet" alt="casperpad" />
                  </div> */}
                </div>
              
                
                {/*footer*/}
                <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">     
                              
                  <button
                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-3  ease-linear transition-all duration-150"
                    onClick={()=>setIsOpen(false)}
                    type="button"                   
                  >
                    Cancel
                  </button>
                  <button
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-3 ease-linear transition-all duration-150"
                      type="submit"
      
                      
                    >
                     create a Community
                    </button> 
                </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          
        </>
    

     
    );
  }
  
  export default MyModal;