import React from 'react';
import { Link } from 'react-router-dom';
const PostTypeModal = ({setIsOpenModal, postSort}) => {    
  
    return (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ">
                {/*header*/}
                <div className="flex justify-between items-center py-4 px-6 rounded-t border-b dark:border-gray-600 ">
                    <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                        Select Post Type 
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="walletModal"
                    onClick={()=>{setIsOpenModal(false)}}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400"> Select one of the following type to create a post.</p>
                    <ul className="my-4 space-y-3">
                        <li key="1">
                            <Link to={`/postcreate/public?postSort=${postSort}`} 
                            onClick={()=>{setIsOpenModal(false)}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">Public</span>
                                {/* <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Popular</span> */}
                            </Link>
                        </li>
                        <li  key="22">
                            <Link  to={`/postcreate/private?postSort=${postSort}`}
                              onClick={()=>{setIsOpenModal(false)}}
                             className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">Private</span>
                            </Link>
                        </li>
                        <li  key="33">
                            <Link  to={`/postcreate/paid?postSort=${postSort}`} 
                              onClick={()=>{setIsOpenModal(false)}}
                            className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                
                                <span className="flex-1 ml-3 whitespace-nowrap">Paid</span>
                            </Link>
                        </li>
                      
                    </ul>
                    {/* <div>
                        <a href="#" className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                            
                            Why do I need to connect with my wallet?</a>
                    </div> */}
                </div>
               
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" ></div>
          
        </>
    
    );
  }
  
  export default PostTypeModal;

