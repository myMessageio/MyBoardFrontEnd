import React from 'react';

import { privatePostCreatePayAmount,paidContentCreatePayAmount } from '../../Web3Api/env';
const MyModal = ({setIsOpen,specialCreate, postType}) => {  
    function payTosubmit(){
      setIsOpen(false)
      specialCreate()
    }
  
    return (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-8 border-b border-solid border-blueGray-200 rounded-t">
                {postType==1&&(
                  <h5 className="text-3xl font-semibold">
                   Private Post
                  </h5>)}
                {postType==2&&(
                  <h5 className="text-3xl font-semibold">
                   Paid content Post
                  </h5>)}
                 
                </div>
                {/*body*/}
                
          
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t" >
                  
                    <div className="w-full lg:w-8/12 px-4">
                      <div className="relative w-full mb-3">
                      {postType==1&&(
                         <p className="mb-1 text-lg leading-relaxed text-blueGray-700">
                            you must pay {privatePostCreatePayAmount} {" "}
                          MESA tokens
                          in order to create private content</p>)}
                        {postType==2&&(
                         <p className="mb-1 text-lg leading-relaxed text-blueGray-700">
                            you must pay {paidContentCreatePayAmount}  {" "}
                            MESA tokens
                          in order to create paid content</p>)}
                      </div>
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
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={payTosubmit}
                      
                    >
                     create
                    </button>            
                  <button
                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    onClick={()=>setIsOpen(false)}
                    type="button"                   
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          
        </>
    

     
    );
  }
  
  export default MyModal;