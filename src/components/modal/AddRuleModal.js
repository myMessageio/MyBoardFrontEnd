import React, { useState } from 'react';

const AddRuleModal = ({setIsOpenModal,SaveSettingChange}) => {  
    const [ruletitle,setRuleTitle]=useState("");
    const [ruleDescription,setRuleDescription]=useState("");
    const [reportReason,setReportReason]=useState("");
    const [applyObjtype,setApplyObjtype]=useState(0);

    function addNewRule(){
        var newRule={
            rule:ruletitle,
            description:ruleDescription,
            reportReason:reportReason,
            applyObjtype:applyObjtype
        }
        SaveSettingChange(newRule)
        setIsOpenModal(false);
    }
  
    return (
        <>
          {/* <div className="container mx-auto px-4 h-full pt-10  z-50> */}
        <div
          className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none px-4"          
        >
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-9/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
         
      
              <div className="rounded-t bg-green-600 mb-0 px-6 py-6">
                <div className="text-center flex justify-between">
                  <h6 className=" text-xl font-bold text-white">Add Rule</h6>
                  
                </div>
              </div>
              <div className="flex-auto px-1 lg:px-3 py-2 pt-0">
               
                 
                  <div className="flex flex-wrap mt-6">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Rule
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Write rule."
                          value={ruletitle}
                          onChange={(e)=>setRuleTitle(e.target.value)}
                          rows="2"
                         
                        ></textarea>
                         <h6 className="text-blueGray-400 text-sm mb-2 font-bold ">
                           97 Charactoes remaining.
                        </h6>
                      </div>
                    </div>
                    <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Applies to</label>
                        <div className="flex items-center px-4">
                            <input id="default-radio-1" type="radio" value="0" name="default-radio" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:border-gray-600"
                            checked={applyObjtype==0}
                            onChange={(e)=> {setApplyObjtype(e.target.value)}}
                            />
                            <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Posts and Comments</label>
                        </div>
                        <div className="flex items-center px-4">
                            <input  id="default-radio-2" type="radio" value="1" name="default-radio"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:border-gray-600"
                            checked={applyObjtype==1}
                            onChange={(e)=> {setApplyObjtype(e.target.value)}}
                            />
                            <label  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Only Posts</label>
                        </div>
                        <div className="flex items-center px-4">
                            <input  id="default-radio-2" type="radio" value="2" name="default-radio" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:border-gray-600"
                            checked={applyObjtype==2}
                            onChange={(e)=> {setApplyObjtype(e.target.value)}}
                            />
                            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Only Comments</label>
                        </div>          
                        </div>
                    </div>
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"                        
                        >
                          Report Reason
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Write a report reason."
                          rows="2"
                          value={reportReason}
                          onChange={(e)=>setReportReason(e.target.value)}
                         
                        ></textarea>
                        <h6 className="text-blueGray-400 text-sm mb-2 font-bold ">
                           97 Charactoes remaining.
                        </h6>
                      </div>
                    </div>
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password" 
                        >
                         Full description
                        </label>
                        <textarea
                          type="text"
                          className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Write a description."
                          rows="5"
                          value={ruleDescription}
                          onChange={(e)=>setRuleDescription(e.target.value)}
                        ></textarea>
                         <h6 className="text-blueGray-400 text-sm mb-2 font-bold ">
                           500 Charactoes remaining.
                        </h6>
                      </div>
                    </div>
                  
                 
                  </div>


                  <hr className="mt-1 border-b-1 border-blueGray-300" />
               
               

                  <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">     
                    <button
                        className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={addNewRule}
                      
                    >
                     Add
                    </button>            
                  <button
                    className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-3 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    onClick={()=>setIsOpenModal(false)}
                    type="button"                   
                  >
                    Cancel
                  </button>
                </div>

            
               
              </div>
      
            </div>
          </div>
        </div>

        
      </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" ></div>
          
        </>
    
    );
  }
  
  export default AddRuleModal;

