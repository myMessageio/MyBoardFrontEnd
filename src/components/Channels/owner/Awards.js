
import React,{useState,useEffect} from "react";

import { backendPostRequest } from "../../../axios/backendRequest";
import { getUserProfile } from "../../../Web3Api/Web3";
export default function Awards({account, chainId,active,channelDBInf,color, channelInf }) {
  

  const [awards,setAwards]=useState([]); 

  async function getdata(newselect){   
    var skip=0;   
    if(!newselect &&awards.length>0){
       skip=awards.length;
    }  

    let formData = new FormData();    


    formData.append("network", channelDBInf.network.toString());
    formData.append("contractaddress", channelDBInf.contractaddress.toString());
    formData.append("channelId", channelDBInf.channelId);
    formData.append("offset", skip);
    
    
    var res=await backendPostRequest("channel/awardlist", formData);
   
    if(res.status==200){
      if(res.data.awards){
        var selawards=[]
        for(let award of   res.data.awards){      
       
          var creatorprofile=await getUserProfile(award.postcreator);
          var awardprofile=await getUserProfile(award.awarduser);
          award.creatorprofileImgUrl=creatorprofile.profileImgUrl
          award.creatorname=creatorprofile.username
          award.awardername=awardprofile.username
          award.awarderprofileImgUrl=creatorprofile.profileImgUrl
          selawards.push(award)
        }

        console.log(selawards)

        
        if(newselect){
          setAwards(selawards) 
        }else{
          var newawards=awards.concat(selawards) 
          setAwards(newawards) 
        }
        
      }
    }

   
  }


  useEffect(()=>{
    if(channelInf){
      getdata(true);
    }
  
  },[channelInf])

  // const [postlist, setpostlist]=useState([]);
  function showMore(){
    getdata(false)
  }
  return (
    <>
      <div
        className=
          "relative flex flex-col min-w-0 break-words w-full mb-6  rounded "
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 bg-green-600 mb-2">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3  className= "font-semibold text-lg text-white" >
                Joined Members
              </h3>
            </div>
          </div>
        </div>
          <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color == "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
       
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className=
                    "text-center align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                 >
                  No
                </th>
                <th
                  className=
                    "text-center align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                 >
                  Post Title
                </th>
                <th
                  className=
                    " text-center align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold  bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    
                >
                  From User
                </th>
                <th
                  className=" align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold  bg-blueGray-50 text-blueGray-500 border-blueGray-100"                    
                
                >
                  From UserAddress
                </th>  
                <th
                  className=
                    " text-center align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold  bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                 
                >
                  to User
                </th>
                <th
                  className=" align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold  bg-blueGray-50 text-blueGray-500 border-blueGray-100"                    
                
                >
                  to UserAddress
                </th> 
                <th
                  className=" align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold  bg-blueGray-50 text-blueGray-500 border-blueGray-100"                    
                
                >
                  Award Count
                </th>               
               
               
                
              </tr>
            </thead>
           
            <tbody>
              {awards.map((award,i)=>{     
                console.log(award)            
                return(
                  <tr className="border-b-0 mb-1 mt-1">
                    <td className="text-center border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-center">
                      {i+1}
                    </td>
                    <td className=" text-center border-t-0 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-center">
                      {award.title.substring(0,30)}
                    </td>
                    <td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-1 text-center flex items-center">
                      <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                      <img
                          src={`https://ipfs.io/ipfs/${award.creatorprofileImgUrl}`}
                          // className="h-12 w-12 bg-white rounded-full border"
                          className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                          alt="..."
                        ></img>
                      </span>
                        <span className="ml-3 font-bold text-blueGray-600">
                        {award.creatorname}
                        </span>
                    </td>
                    <td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-center">
                    
                      <span
                        className="ml-3 font-bold text-blueGray-600" 
                      >
                        {award.postcreator.substring(0,6)+"..."+award.postcreator.substring(38)}
                      
                      </span>
                    </td>
                    <td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-center flex items-center">
                      
                      <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                      <img
                          src={`https://ipfs.io/ipfs/${award.awarderprofileImgUrl}`}
                          // className="h-12 w-12 bg-white rounded-full border"
                          className="w-full w-12 h-12 rounded-full align-middle border-none shadow-lg"
                          alt="..."
                        ></img>
                      </span>
                        <span className="ml-3 font-bold text-blueGray-600">
                        {award.awardername}
                        </span>
                    </td>
                    <td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-center">
                    
                      <span
                        className="ml-3 font-bold text-blueGray-600" 
                      >
                        {award.awarduser.substring(0,6)+"..."+award.awarduser.substring(38)}
                      
                      </span>
                    </td>
                    <td className="border-t-0  align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-center">
                    
                      <span
                        className="ml-3 font-bold text-blueGray-600" 
                      >
                        {award.awards}
                      
                      </span>
                    </td>
                  
                  </tr>
                  )
              })}
            </tbody>
           
          </table>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <button className="text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white active:bg-teal-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
            onClick={showMore}
            >
          show more
        </button>
      
      </div> 
      </div>
    </>
  );
}

