import React,{useState} from "react";
import { Button } from "@material-tailwind/react";
  
export default function SearchBox({  
  currentUserProfile,
  account,  
  getdata
}) { 
  const [inputText,setInputText]=useState('');
  async function onSearchButtonClick(){   
    if(inputText){
      getdata(true,inputText)
    }else{
      getdata(true,'')
    }
   
  }

 


  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-blueGray-100 border-0">

        <div className="flex-auto p-4 bg-white rounded-lg">
          <div className="flex flex-wrap">
            <div className="relative w-auto  flex-initial ">              
                {currentUserProfile? (<img
                  src={`https://ipfs.io/ipfs/${currentUserProfile.profileImgUrl}`}
                  className="h-12 w-12 bg-white rounded-full border"
                  alt="..."
                ></img>):(
                  <img
                  src={`https://ipfs.io/ipfs/bafkreieyptduhrus2inmamc3mi4sbqvqddz65ve6itcmlncylj6upmz5ke`}
                  className="h-12 w-12 bg-white rounded-full border"
                  alt="..."
                ></img>
                
              )}


            </div>
            <div className="relative w-full pl-4 max-w-full flex-grow flex-1">
           
               <div className="md:flex  flex-row flex-wrap items-center lg:ml-auto mr-3">
                  <div className="relative flex w-full flex-wrap items-stretch">  
                     <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                      <i className="fas fa-search"></i>
                    </span>                 
                    <input
                      type="text"
                      placeholder="search title, did, tx_id"                    
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
                      onChange={(e)=>setInputText(e.target.value)}
                    />
                  </div>
                </div>
            </div>
         
            <div className="relative w-auto  flex-initial ">
              <Button className="bg-green-600" onClick={onSearchButtonClick}>search</Button>
             
            </div>
           
            
          

            
          </div>
          
        </div>
      </div>      
     
    </>
  );
}

