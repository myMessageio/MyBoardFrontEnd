import Web3 from 'web3';
import {fetchIPFSText} from "../ipfs/ipfs"
import { useWeb3React } from "@web3-react/core";
import { imageDecryptUrl,mainDecryptData } from '../ipfs/ipfs';
import { backendPostRequest } from '../axios/backendRequest';
//const alertEventTableName="BSCAlertHistoryTBAF"//(BSC)
import { backenddomain,contractAddresses,rpc_urls,Abis,networkNames,activeChainIds
   } from './env';
export const backendUrl=backenddomain+"/myboardbackend/"


////////////////////////////////////////////////////////////////////////////////////
const UseReadContract= (contractName,networkName)=>{
  var abi=Abis[contractName];
  var rpc_url=rpc_urls[networkName];
  var contractAddress=contractAddresses[networkName][contractName];

  const web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
  const contract =new  web3.eth.Contract(abi, contractAddress);
  
  return contract;

}
const UseWriteContract = (abi, address,rpc_url) => {
  const { library } = useWeb3React();
  const httpProvider = new Web3.providers.HttpProvider(rpc_url, {
    timeout: 10000,
  });
  const web3 = new Web3(library.currentProvider || httpProvider);
  return new web3.eth.Contract(abi, address);
};

export const getWriteContract=(chainId,account, active,contractName)=>{
  if(account&&active&&chainId){
    var networkName=networkNames[chainId];
     
    if(!networkName){
      return null;
    }
    var abi=Abis[contractName];
    var rpc_url=rpc_urls[networkName];
    var contractnetworkAddress=contractAddresses[networkName];
    var contractAddress=null;
    if(contractnetworkAddress){
      contractAddress=contractAddresses[networkName][contractName];
    }

    if(abi&&rpc_url&&contractAddress){          
      return UseWriteContract(abi,contractAddress,rpc_url);
    }else{
     
      return null
    } 
 
  }else{
    return null
  }

}

export async function  getStartLastBlockNumber(networkName){
  var rpc_url=rpc_urls[networkName];  
  const web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
  const lastblocknumber=await web3.eth.getBlockNumber()
  const startBlocknumber=contractAddresses[networkName]["startblock"]
  return [startBlocknumber,lastblocknumber];
}
///////////////getuserprofile
export async  function getUserProfile(account){
  if(account){   
    var userExtract=null; 
   
  
    var resdata=null
    var selchainId=null;
    for(let activechainId of activeChainIds){
      const selcontract=UseReadContract("myboard",networkNames[activechainId]);
      
      userExtract=await selcontract.methods.getUserProfile(account).call(); 
      if(userExtract.username!=''){
        selchainId=activechainId;
        break;
      } 
    }
   
    if(userExtract.username!=''){ 
      resdata={
        username:userExtract.username,      
        profileImgUrl:userExtract.profileImgUrl,
        address:   account,
        chainId: selchainId 
      }   
    }else{
      resdata={
        username:"NO NAME",      
        profileImgUrl:"bafkreieyptduhrus2inmamc3mi4sbqvqddz65ve6itcmlncylj6upmz5ke",
        address:   account  
      }   
    }
   
  return resdata; 
  }else{

    return null
  }
}
export async  function getUserProfile1(account){
  if(account){   
 
    const selcontract=UseReadContract("myboard","mbase");
    if(selcontract){
      var userExtract=await selcontract.methods.getUserProfile(account).call(); 
      var resdata=null
      if(userExtract.username!=''){ 
        resdata={
          username:userExtract.username,      
          profileImgUrl:userExtract.profileImgUrl     
        }   
      }

      return resdata; 
    }else{
      return null
    }
  }else{

    return null
  }
}
export async function  getPostInf(account,postId,privatekey,deployedNetwork){
  const selcontract=UseReadContract("myboard",deployedNetwork);
  var callParam={}
  if(account){
    callParam={from: account.toString()}
  }
  // console.log(selcontract)
  // callback([null,null,null]);  
  // return  
  var detailextract=await selcontract.methods.getPost(postId,privatekey).call(callParam);
  // console.log(detailextract);
  var detailInf=null
  var pollVoteInf=null;
  console.log(detailextract)
  if(!detailextract.postId){
    detailInf=null
  }else{
    var content=null
    if(detailextract.contentUrl){   
      var contentstr=await fetchIPFSText(detailextract.contentUrl)
      content= await JSON.parse(contentstr)       
      if(content.dataurl&&detailextract.encryptkey!=''){
        if(content.postSort==1){
          content.imageurl=await imageDecryptUrl(content.dataurl,detailextract.encryptkey)
        }else{
          content.data=await mainDecryptData(content.dataurl,detailextract.encryptkey)
        }
        
      }
    }  
   
   
    var  created_at =new Date(detailextract.timestamp*1000);   
    detailInf={      
      title:detailextract.title,
      creator:detailextract.creator,
      timestamp:detailextract.timestamp,
      content:content,
      postSort:detailextract.postSort,
      postType:detailextract.postType,
      channelId:detailextract.channelId,
      postId:detailextract.postId,
      awardCount:detailextract.awardCount,
      upvotes:detailextract.upvotes,
      downvotes:detailextract.downvotes,
      votecount:detailextract.votecount,
      created_at:created_at,
      commentcount:detailextract.commentcount
      
    }
 
    if(detailInf.postSort==3){
     
      var pollVoteExtract=await  selcontract.methods.getPostPollVoteInf(postId).call(callParam);    
      if(pollVoteExtract==undefined){
        pollVoteInf=null
      }else{
        pollVoteInf=pollVoteExtract
      }
    }
  }

  
  var otherextract=await selcontract.methods.getPostOtherInf(postId).call(callParam)  

  var otherInf=null;
  if(!otherextract){
    
    otherInf=null
  }else{
    otherInf=otherextract
  }

 
  return [detailInf,otherInf,pollVoteInf];  
}

export async function privateKeyCheck(account,postId,privatekey,deployedNetwork){ 
  const selcontract=UseReadContract("myboard",deployedNetwork);
  var callParam={} 
  if(account){
    callParam={from: account.toString()}
  }
  var dataExtract=await selcontract.methods.checkPrevivatekey(postId,privatekey).call(callParam);
  return dataExtract;

}


export async function  getCommentInf(account,commentId,privatekey,deployedNetwork){
 
  
  const selcontract=UseReadContract("myboard",deployedNetwork);
  var callParam={}
  if(account){
    callParam={from: account.toString()}
  }

  var detailextract=await  selcontract.methods.getComment(commentId,privatekey).call(callParam);  
  
  var detailInf=null
  if(detailextract==undefined){
    detailInf=null
  }else{ 
    var content=null
    if(detailextract.contentUrl!=""){

      content=await mainDecryptData(detailextract.contentUrl,detailextract.encryptkey)
    }
    
    var  created_at =new Date(detailextract.timestamp*1000); 
    detailInf={
      creator:detailextract.creator,
      postId:detailextract.postId,
      parentCommentId:detailextract.parentCommentId,
      upvotes:detailextract.upvotes,
      downvotes:detailextract.downvotes,
      awardCount:detailextract.awardCount,
      timestamp:detailextract.timestamp,     
      content:content,
      created_at:created_at
    }
  }

  var otherextract=await  selcontract.methods.getCommentOtherInf(commentId).call(callParam)
  
  // console.log(otherextract,commenOtherInfOpt)
  var otherInf=null;
  if(otherextract==undefined){
    otherInf=null
  }else{
    otherInf=otherextract
  }  

  return [detailInf,otherInf];

}

export async function getChannelInf(account,channelId,deployedNetwork){
  const selcontract=UseReadContract("myboard",deployedNetwork);
  var callParam={}

  if(account){
    callParam={from: account.toString()}
  }

  
  var extractInf=await selcontract.methods.getChannelInf(channelId).call(callParam)
  var dataInf=null;
  if(extractInf==undefined){
    dataInf=null
  }else{    
    var contentstr= await fetchIPFSText(extractInf.channelInf.contentUrl)
    var content=await JSON.parse(contentstr) 
    if(typeof content=='string'){
      content=await JSON.parse(content) 
    }

    dataInf={
      channelId:extractInf.channelInf.channelId,
      iconImgUrl:extractInf.channelInf.iconImgUrl,
      inf:content,
      creater:extractInf.channelInf.creater,
      membercount:extractInf.channelInf.membercount,
      joincount:extractInf.channelInf.joincount,
      name:extractInf.channelInf.name,
      postcount:extractInf.channelInf.postcount,
      timestamp:extractInf.channelInf.timestamp,
      joined:extractInf.joined
    }    
  } 

  return dataInf   
}

export async function getMESABalanceOfUser(account,deployedNetwork){
  const selcontract=UseReadContract("mesa",deployedNetwork); 
  if(!account){
    return 0;
  }
 
  var extractInf=await selcontract.methods.balanceOf(account.toString()).call()
  return extractInf  
}
export async function getMESAAAllowanceOfUser(account,deployedNetwork){
  const selcontract=UseReadContract("mesa",deployedNetwork);
  if(!account){
    return 0;
  }
  var contractnetworkAddress=contractAddresses[deployedNetwork];
  var spender=null;

  if(contractnetworkAddress){
    spender=contractAddresses[deployedNetwork]["myboard"];
  }
  if(!deployedNetwork||!spender){
    return null
  }  
 
  var extractInf=await selcontract.methods.allowance(account.toString(),spender).call()
  return extractInf  
}






///////////////createAccount
export const  userProfileUpdate=async (chainId,contract,account,username,profileImgUrl)=>{
  var networkName=networkNames[chainId];
  if(!networkName||!account){
    return "error"
  } 
  try{
    const res= await contract.methods
    .setUserProfile(username,profileImgUrl)
    .send({ from: account    
    } ) 
    return "success"

  }catch(e){
   return "error"
  }
}

export const createCommunityChannel= async(chainId,contract,account,channelName,contentUrl,iconImgUrl)=>{
  var networkName=networkNames[chainId];
  if(!networkName||!account){
    return "error"
  } 
  var eventName="newChannelCreated";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }
  try{
    await contract.methods
    .createChannel(channelName,contentUrl,iconImgUrl)
    .send({ from: account ,   
    } )  
    return "success"
  }catch(e){
    return "error"
  } 
  
}
export async function editCommunityChannel(chainId,contract,account, channelId,contentUrl,iconImgUrl,topics){  
 
 
   var networkName=networkNames[chainId];

  if(!networkName||!account){
    return "error"
  } 
  var eventName="channelSettingUpdated";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }
  
  try{
    await contract.methods
    .editChannel(channelId,contentUrl,iconImgUrl,topics)
    .send({ from: account ,   
    } )    
    return "success"

  }catch(e){
    return "error"

  } 
  
}
export const createPostonMyBoard= async(chainId,contract,account,channelId,privatekey,title,contentUrl,encryptkey,posttype,postsort,pollcount,expireTime)=>{
  
   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  } 
  var eventName="newPostCreated";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }
  try{
    await contract.methods
    .createPost(channelId,privatekey,title,contentUrl,encryptkey,posttype,postsort,pollcount,expireTime)
    .send({ from: account      
    } )  
    return "success";
  }catch(e){
    return "error"

  } 
}

export async function postVoteUpSet(chainId,contract,account,postId,){
   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  }  
  var eventName="voteToPost";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  } 
  try{
    await  contract.methods
    .postVoteUpSet(postId)
    .send({ from: account       
    } )  
    return "success";

  }catch(e){
    return "error"

  }

}
export async function postVoteDownSet(chainId,contract,account,postId,){
   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  }   
  var eventName="voteToPost";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  } 
  try{
    await  contract.methods
    .postVoteDownSet(postId)
    .send({ from: account       
    } ) 
    
    return "success";

    
 

  }catch(e){
    return "error"

  }
}
export const awardToPost=async(chainId,contract,account,postId)=>{   


   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  }   
  var eventName="awardToThePost";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  } 

  try{
    await  contract.methods
    .awardToPost(postId)
    .send({ from: account       
    } )    

    return "success";

  }catch(e){
    return "error"

  }

}

export async function pollItemVote(chainId,contract,account,postId,pollid){
   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  }   
  try{
      await  contract.methods
    .postPollVote(postId,pollid)
    .send({ from: account       
    } )    


      return "success"
  }catch(e){
    return "error"

  }
}

export async function viewPaidContentPermit(chainId,contract, account,postId){ 
    var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  }   
  try{
    await contract.methods
    .paidPostReadAllow(postId)
    .send({ from: account     
    } )     
    return "success"

  }catch(e){
    return "error"

  } 
  
}



export const MesaTokenApprove= async(chainId,contract,account,payAmount)=>{
  let approveAmount =  payAmount.toString()+"000000000000000000";
   var networkName=networkNames[chainId];
  var contractnetworkAddress=contractAddresses[networkName];
  var spender=null;

  if(contractnetworkAddress){
    spender=contractAddresses[networkName]["myboard"];
  }
  if(!networkName||!spender){
    return "error"
  }  

  try{
    await contract.methods
    .approve(spender,approveAmount)
    .send({ from: account,
    
    } )     
    return "success"

  }catch(e){

    return "error"

  } 
}


///////writecomment
export async function createComment(chainId,contract, account,postId,contentUrl,pareComentId,privateKey,encryptkey){ 


   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  }
  var eventName="newCommentCreated";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }  
  try{
    await contract.methods
    .createComment(postId,contentUrl,encryptkey,pareComentId,privateKey)
    .send({ from: account      
    } ) 
    return "success";

  }catch(e){
    return "error"

  } 


}
export async function awardToComment(chainId,contract,account,commentId){
 

   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  } 
  var eventName="awardToTheComment";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }  
  try{
   await contract.methods
    .awardToComment(commentId)
    .send({ from: account      
    } )  

    return "success";

  }catch(e){
    return "error"

  } 

  

}
export async function commentVoteUpSet(chainId,contract,account,commentId){
   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  } 
  var eventName="voteToComment";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }  
  try{
    await contract.methods
    .commentVoteUpSet(commentId)
    .send({ from: account      
    } )  
    return "success";

  }catch(e){
    return "error"

  } 

}
export async function commentVoteDownSet(chainId,contract,account,commentId){
   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  } 
  var eventName="voteToComment";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }  
  try{
    await contract.methods
    .commentVoteDownSet(commentId)
    .send({ from: account      
    } )  
    return "success"
 

  }catch(e){
    return "error"

  } 
}




export async function joinChannel(chainId,contract,account,channelId){ 
   var networkName=networkNames[chainId]; 
  if(!networkName||!account){
    return "error"
  } 
  var eventName="channelJoined";
  var contractaddress=contract._address;
  var registres=await registBlockNumberInDB(networkName,eventName,chainId,contractaddress);
  if(registres=="error"){
    return "error";
  }  

  try{
    await contract.methods
    .JoinChannel(channelId)
    .send({ from: account      
    } )
    return "success";

  }catch(e){

    return "error"

  } 

}
// export function createSubComment(web3fetch, commentOpt,setSubmitting,setCommentInputForm,setReplyState,getSubCommandIds){ 
  
//   setSubmitting('submitting');
//   web3fetch({params:commentOpt,
//     onSuccess: (result) =>result.wait(1).then(()=>{     
//         console.log(result);
//         setSubmitting("ready")
//         SuccessToast('Comment is successfully submitted!')   
//         setCommentInputForm("")
//         setReplyState(false) 
//         getSubCommandIds() 
//         // history.push('/user/postlist')   
//       }),
//     onError: (error1) =>{
//       console.log(error1);
//       setSubmitting("ready");      
//       if(error1.message){
//         ErrorToast(error1.message)
        
//       }else{
//         if(error1.length>0){
//           error1.map((err)=>{
//             ErrorToast(err)
//           })
//         }

//       }
 
//     },
//   })
// }

  //  console.log(account);
   
//     const web3 = new Web3(libary.currentProvider || httpProvider);
//     const contract= new web3.eth.Contract(reddit_abi, reddit_address);
//     let customGas = 300000;

//     contract.methods
//     .registerUser('sfsd','sdfsd@gmaill.com','QmdUN7tEx1T5EzyL6mMB43sSpcvmmBRS4VV944ZQG3K4Jw','QmdUN7tEx1T5EzyL6mMB43sSpcvmmBRS4VV944ZQG3K4Jw','QmUqeezAbc7AdGeNPFhjCpxkqrVN3xXohoJrGqpNe9oF2a')
//     .send({ from: account,
//       gas: customGas,
//        gasPrice: web3.utils.toWei("10", "gwei").toString(),

//     });
  
//}


///////////////////////////////////////////
// export const getNetworkNameFromChainId=async(chainId)=>{
//   var networkName=networkNames[chainId];
   
//   return networkName;
  
// }

async function registBlockNumberInDB(networkName,eventName,chainId,contractaddress){
  var rpc_url=rpc_urls[networkName];  
  var lastblocknumber=0;
  var trycount=0;
  while(lastblocknumber==0 && trycount<5){
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
    lastblocknumber=await web3.eth.getBlockNumber();
    trycount++;
  } 
  if(!lastblocknumber){
    return "error"
  }

 
  let formData1 = new FormData();   
  formData1.append("eventName", eventName);
  formData1.append("blocknumber", lastblocknumber);
  formData1.append("network", networkName);
  formData1.append("chainId", chainId);
  formData1.append("contractaddress", contractaddress);
  const reg_res = await backendPostRequest("home/checklastblockregist", formData1);  

  if(reg_res.status==200){
    if(reg_res.data.result=="success"){

    }else{
      return "error";
    }
  }else{
    return "error";
  } 

}
