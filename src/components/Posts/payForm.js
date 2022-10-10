import React, { useState }  from "react";
import PayModal from "../modal/PayModal"
import Loading from "../../components/Loading/loading" ;
export default function({payToAuthor,submitting,
  active,
  chainId,
  account,
  postedChainId,
  setIsOpenSwitchNetworkModal,
}){
  // const history = useHistory() 
  const [isPayModalOpen,setPayModalOpen] = useState(false)
 ///loadingstate

  function payButtonPress(e){ 
    e.preventDefault(); 
    
    if (active&&account&&chainId==postedChainId){  
       setPayModalOpen(true)
    }
    else{  
 
      setIsOpenSwitchNetworkModal([true,true,postedChainId])
      // history.push('/user/signup')
    }
  }

  return(
    <div className="w-full lg:w-8/12 px-4 mt-12">
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded xl:mb-0 shadow-lg">
          {submitting=="approving"&& (
          <Loading title="approving"/>
          ) }
            {submitting=="permitting"&& (
          <Loading title="permitting"/>
          ) }
          <div className="flex-auto pl-8 pr-8 pt-10">
            <div className="flex flex-wrap">
              <div className="relative w-full mb-1">
                <label
                  className="block  text-blueGray-600 text-lg font-bold mb-2"
                  htmlFor="grid-password"
                >
                  You must send 100 messa to author  in order to view this post
                </label>
                {/* {(authorInf)&&(
                <label
                  className="block  text-blueGray-600 text-lg font-bold mb-2"
                  htmlFor="grid-password"
                >
           
                </label>)} */}
              
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      
                      </h6>
                    <button
                      className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      onClick={payButtonPress}
                      
                    >
                    send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {isPayModalOpen&&
        (<PayModal setIsOpen={setPayModalOpen} payToAuthor={payToAuthor} />)}
      </div>
    </div>

  )
}