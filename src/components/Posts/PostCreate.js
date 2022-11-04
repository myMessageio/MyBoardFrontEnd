import React, { useEffect, useState }  from "react";
import  Loading from "../../components/Loading/loading";
import ImageUploader from "../../components/ImageUpload/index.js";
import CreateModal from "../../components/modal/createModal";
import CreateChannelModal from "../../components/modal/createChannelModal";
import Abstract from "./abstract";


import {paidContentCreatePayAmount,privatePostCreatePayAmount,contractAddresses,networkNames} from "../../Web3Api/env"
import {createPostonMyBoard,createCommunityChannel,getWriteContract} from "../../Web3Api/Web3"

import {SuccessToast,ErrorToast} from "../toast/toast"
import ChannelSelector from "./ChannelSelectorForm"
///toast

import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';

import { useNavigate,} from "react-router-dom";
import '../../assets/styles/selectsearch.css';

import {jsonDataUploadtoIpfs, imageEncryptUploadtoIpfs, mainDataEncryptUploadToIpfs} from "../../ipfs/ipfs"
import { MesaTokenApprove, getMESABalanceOfUser,
  getMESAAAllowanceOfUser } from "../../Web3Api/Web3";
import { backendPostRequest } from "../../axios/backendRequest";
import { Radio,Input  } from "@material-tailwind/react";


export default function PostCreate(
  {account,active, chainId,setIsOpenSwitchNetworkModal}
) {
 
  const MesaTokenContract=getWriteContract(chainId,account,active,"mesa")
  const MyBoardContract=getWriteContract(chainId,account,active,"myboard");
  const postTypes=["public","private","paid"];
  const [postType,setPostType]=useState(0);
  const [selectChannelID, setSelectChannelID]=useState(null);

  //////variable for posting

  const color="blueGray";
  const [postSort, setPostSort] = useState(0);
  const [descriptionContent, setDescriptionContent] = useState("");
  const [abstractDescription, setAbstractDescription] = useState("");
  const [title, setTitleContent] = useState("")
  const [postImg,setPostImg]=useState("");
  const [linkUrl, setLinkUrl] = useState("")
  const [pollItems, setPollItems] = useState([])
  const [privatekey, setPrivateKey]=useState("");
  const [expireTime, setExpireTime]=useState(1);
  const [ocState, setOCState]=useState(false);
  const [spolierState, setSpolierState]=useState(false);
  const [nsfwState, setNSFWState]=useState(false);
  const[submitting, setSubmitting]=useState('ready')
  const [isOpenModal,setIsOpenModal]=useState(false) 

  const [isOpenCreateChannelModal,setIsOpenCreateChannelModal]=useState(false) 


  ///////quill
  const modules={
    
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
  
      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ indent: '-1'}, { indent: '+1' }],
       [{ 'script': 'sub' }, { 'script': 'super' }],
      
      ['link', 'image' ],
      [{ color: [] }, { background: [] }],
  
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
    blotFormatter: {}
    
  
}

const { quill, quillRef, Quill } = useQuill({
  theme:"snow",
  modules: modules,
  placeholder:"Write content..."
});

if (Quill && !quill) {
  // const BlotFormatter = require('quill-blot-formatter');
  Quill.register('modules/blotFormatter', BlotFormatter);
}


////quill effect
useEffect(() => {
  if (quill) {
    quill.on('text-change', (delta, oldContents) => {          
      setDescriptionContent(quill.root.innerHTML)
    });
  }
}, [quill, Quill]);
// function contentclear(){
//   quill.root.innerHTML="";
// }

////




  const navigate = useNavigate() 

  useEffect(()=>{
    getDefaultOptions(setDefaultOptions)
  },[account, active,chainId])

  useEffect(()=>{
    setAbstractDescription("");

  },[postType])
  ////////pollItemsetfunc
  async function changePollItem(textval, i){
   
    var pollItemValues=pollItems;
    
    pollItemValues[i]=textval.toString();
    setPollItems(pollItemValues);
  }
  const  addPollItem=()=>{
    let temp = pollItems.map((Item) => Item)
    temp.push("")
    setPollItems(temp);
  }
  const  removePollItem=(i)=>{
    let temp = pollItems.map((Item) => Item)
    temp.splice(i,1)
    setPollItems(temp);
  }
 ////////posting function
  async function encryptMainDataUpload(){
    setSubmitting("uploadingToIpfs");
  switch(postSort) {
    case 0://////post       
      mainDataEncryptUploadToIpfs(JSON.stringify(descriptionContent),uploadPostDataToIpfs);         
      break;
    case 1:///////image       
      imageEncryptUploadtoIpfs(postImg,uploadPostDataToIpfs);  
      
      break;
    case 2:///////link       
    mainDataEncryptUploadToIpfs(JSON.stringify(linkUrl),uploadPostDataToIpfs); 
      
    // code block
    break;
    case 3:///////Poll
      
    mainDataEncryptUploadToIpfs(JSON.stringify(descriptionContent),uploadPostDataToIpfs);
    // code block
    break;
    default:
      // code block
  }
 

}
  async function uploadPostDataToIpfs(dataUrl,encryptionkey){
   
   if(dataUrl&&encryptionkey){
    var content={
      "title":title,
      "postSort":postSort,
      "posttype":postType,
      "dataurl":dataUrl,
      "pollItems":pollItems,
      "expiretime":expireTime,
      "abstractDescription":abstractDescription,
      "oc":ocState,
      "spolier":spolierState,
      "nsfw":nsfwState
    }
    var contentUrl=  await  jsonDataUploadtoIpfs(content); 
    createPost(contentUrl,encryptionkey)
   }else{
    ErrorToast("Error occurs in Ipfs Uploading");
    setSubmitting("ready");
   }     
   

  }

  async function createPost(contentUrl,encryptionkey){  
    if(!contentUrl){      
      ErrorToast("Error occurs in IPFS Uploading")
      setSubmitting("ready");
      return;

    }
   
  
    var _privatekey="no";

    var networkName=networkNames[chainId.toString()]
   
    var allowanceAmount = await getMESAAAllowanceOfUser(account,networkName)  
   
    if(postType==0){     

    }else if(postType==1){
      if(privatePostCreatePayAmount>Number(allowanceAmount)/Math.pow(10,18)){        
        setSubmitting("approving")
        var res=await MesaTokenApprove(chainId,MesaTokenContract,account,privatePostCreatePayAmount)
        if( res=="success"){
          SuccessToast("Approved successfully")          
        }else{
          ErrorToast("failed in approving")  
          setSubmitting("ready")
          return;    
        }
      }
      _privatekey=privatekey  
     
         
    }else if(postType==2){      
      if(paidContentCreatePayAmount>Number(allowanceAmount)/Math.pow(10,18)){        
        setSubmitting("approving")
        var res=await MesaTokenApprove(chainId,MesaTokenContract,account,paidContentCreatePayAmount)
        if( res=="success"){
          SuccessToast("Approved successfully")          
        }else{
          ErrorToast("failed in approving")  
          setSubmitting("ready")
          return;    
        }
      }
    }
    setSubmitting("creating")
   
    var web3res=await createPostonMyBoard(chainId,MyBoardContract,account,selectChannelID,_privatekey,title,contentUrl,encryptionkey,postType,postSort,pollItems.length,expireTime)
    if(web3res=="error"){
      ErrorToast("Error occurs in creating new post")     
      setSubmitting("ready") 
      return
    }else{
      SuccessToast("New post was created succesfully!")
      setSubmitting("ready")
      navigate('/postlist')

    }
   


  }
  async function createChannel(channelName){

   
    var content={name:channelName,
      description:"",
      topics:[],
      rules:[],      
      setting:{},
      appearance:{
                  iconImg_Url:'QmU6cH3ZUtbW474bQrCK7dXuEqxVnFQqXgnTjBRiMZgikN',
                  coverImg_Url:'',
                  themeColor:"#3423f2",
                  bannerColor:"#3423f2",
                  bannerHeight:64
                }
    }
    setSubmitting("uploadingToIpfs");
    var _contentUrl=await  jsonDataUploadtoIpfs(content)

    if(!_contentUrl){      
      ErrorToast("Error occurs in IPFS Uploading")
      setSubmitting("ready");
      return;

    }
    setSubmitting("channelcreateing");
    
    var res=await createCommunityChannel(chainId,MyBoardContract,account,channelName,_contentUrl,'QmU6cH3ZUtbW474bQrCK7dXuEqxVnFQqXgnTjBRiMZgikN')

    if(res=="success"){
      SuccessToast("New community channel was created successfully!")
    }else{
      ErrorToast("Community channel create failed!")

    }
    setSubmitting("ready");
    getDefaultOptions(setDefaultOptions)
  }
  
  const [defaultOptions,setDefaultOptions]=useState([])
  // useEffect(()=>{
  
  // },[defaultOptions])
  async function getDefaultOptions(callback){
   
    if(active&&chainId&&account){
      var networkName=networkNames[chainId.toString()]
      var contractaddress=contractAddresses[networkName]["myboard"]  

      let formData = new FormData();        
      formData.append("chainId", chainId);
      formData.append("network", networkName);
      formData.append("contractaddress", contractaddress);
      formData.append("creator", account);      
     
      backendPostRequest("channel/userchannelsOnchain", formData).then(function(res){  
    

        var myChannels=[];
        var usedChannels=[]
        var popularChannels=[]  
        for(let channel of res.data.mychannels){    
          myChannels.push({label:channel.channelName ,value:channel.channelId,color: '#0052CC',icon:channel.iconImgUrl})           
        }
        
        for(let channel of res.data.usedchannels){    
          usedChannels.push({label:channel.channelName ,value:channel.channelId,color: '#0052CC',icon:channel.iconImgUrl})           
        }
        for(let channel of res.data.popularchannels){    
          popularChannels.push({label:channel.channelName ,value:channel.channelId,color: '#0052CC',icon:channel.iconImgUrl})           
        }
        
          var opt=[{label:"+Add Community Channel",value:-1},
                    {label:"my channels",options: myChannels},
                    {label:"used",options: usedChannels},
                    {label:"popular",options: popularChannels}
                  
                  ]
       
          callback(opt)   

      }).then(function (error){
        if(error){
   
          var myChannels=[];
          var usedChannels=[]  
       
        
          var opt=[{label:"+Add Community Channel",value:-1},
                    {label:"my channels",options: myChannels},
                    {label:"used",options: usedChannels}
                  
                    
                  ]
                  callback(opt) 
        }
       
             
        
      });  

    }else{
      var myChannels=[];
      var usedChannels=[]  
     
      
      var opt=[{label:"+Add Community Channel",value:-1},
                {label:"my channels",options: myChannels},
                {label:"used",options: usedChannels}              
              ]            
      callback(opt) 
    }    

  }
  async function onSubmit(e){      
    e.preventDefault();  
    if(!selectChannelID){
      ErrorToast("You must select an Communicaty channel");
      return
    }
    if(postType==2){
      if(abstractDescription===""||abstractDescription==="<p><br></p>"||abstractDescription==="<p></p>"){
        ErrorToast("You must input abstract descripton");
        return;
      }
    }
    switch(postSort) {
      case 0://////post   
        if(descriptionContent==""||descriptionContent=="<p><br></p>"||descriptionContent=="<p></p>"){
          ErrorToast("You must input  content");
          return;
        }
         
        break;
      case 1:///////image
        if(!postImg){
          ErrorToast("You must select an Image");
          return;
        }
        break;
      case 2:///////link
      // code block
      break;
      case 3:///////Poll
      
        if(descriptionContent==""||descriptionContent=="<p><br></p>"||descriptionContent=="<p></p>"||descriptionContent.toString==""){
            ErrorToast("You must input an  content");
            return;
          }
     
        
        
        if(pollItems.length<2){
          ErrorToast("You must Add Options");
          return;
        }
      // code block
      break;
      default:
        // code block
    }

    var networkName=networkNames[chainId.toString()]
    var balance = await getMESABalanceOfUser(account,networkName) 
    if(postType==1){
      if(privatekey.length>=5){
        if(privatePostCreatePayAmount>Number(balance)/Math.pow(10,18)){       
          ErrorToast("You don't have enought MESA Tokens in your wallet")  
          setSubmitting("ready");
          return;
        }else{
          setIsOpenModal(true)
        }
     
      }else{
        ErrorToast("You must input private key 5letters  more");
      }
    }else if(postType==2){
      if(paidContentCreatePayAmount>Number(balance)/Math.pow(10,18)){       
        ErrorToast("You don't have enought MESA Tokens in your wallet")  
        setSubmitting("ready");
        return;
      }else{
        setIsOpenModal(true)
      }  
    }else if(postType==0){      
      encryptMainDataUpload()
    }
      
  }

 
//  const  modules = {
//     toolbar: [
//       [{ 'header': [1, 2,3,4,5,6 ,false] }],
//       ['bold', 'italic', ],
//       [{ 'script': 'sub' }, { 'script': 'super' }],
//       [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
//       [ 'image'],
//       ['clean'],
    
//     ],
//     clipboard: {
//       // toggle to add extra line breaks when pasting HTML:
//       matchVisual: false
//     },
//     imageResize: {
//       parchment: Quill.import('parchment'),
//       modules: ['Resize', 'DisplaySize']
//     }
//   }
//   const formats=[
//     'header',    
//     'bold',
//     'italic',
//     'script',
//     'super',
//     'list',
//     'bullet',
//     'indent',   
//     'image',
    
//   ]
  return (
    <>
    {isOpenModal&&(<CreateModal setIsOpen={setIsOpenModal} specialCreate={encryptMainDataUpload} postType={postType} />)}
    {isOpenCreateChannelModal&&(<CreateChannelModal setIsOpen={setIsOpenCreateChannelModal} createChannel={createChannel}/>)}

     {submitting=="uploadingToIpfs"&& (
          <Loading title="uploadingToIpfs"/>
          ) }
      {submitting=="creating"&& (
          <Loading title="creating"/>
          ) }
      {submitting=="approving"&& (
            <Loading title="approving"/>
          ) }
      {submitting=="channelcreateing"&& (
            <Loading title="Community Channel Creating"/>
          ) }
          
      <div className="relative flex flex-col min-w-0 break-words w-full mb-3 shadow-lg rounded-lg bg-white  border-0 ">
        <div className="rounded-t  mb-0 px-6 py-3 bg-green-600" >
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold">Create a {postTypes[postType]} Post</h6>
           
          </div>
        </div>      
        <ChannelSelector           
           getDefaultOptions={getDefaultOptions}          
           defaultOptions={defaultOptions}
           setIsOpenCreateChannelModal={setIsOpenCreateChannelModal}
           setSelectChannelID={setSelectChannelID}
           selectChannelID={selectChannelID}        
           active={active}
           account={account}
           chainId={chainId}
           setIsOpenSwitchNetworkModal={setIsOpenSwitchNetworkModal}


        />
        <div className="flex flex-wrap">
          <div className="w-full">
            <ul
              className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
              role="tablist"
            >
              <li className="-mb-px flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (postSort == 0
                      ? "text-white bg-" + color + "-600"
                      : "text-" + color + "-600 bg-white")
                  }
                  onClick={e => {
                    e.preventDefault();
                    setPostSort(0);
                  }}
                  data-toggle="tab"
                  href="#link1"
                  role="tablist"
                >
                  <i className="fas 	fa-clipboard text-base mr-1"></i> Post
                </a>
              </li>
              <li className="-mb-px  flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (postSort == 1
                      ? "text-white bg-" + color + "-600"
                      : "text-" + color + "-600 bg-white")
                  }
                  onClick={e => {
                    e.preventDefault();
                    setPostSort(1);
                  }}
                  data-toggle="tab"
                  href="#link2"
                  role="tablist"
                >
                  <i className="fas fa-image text-base mr-1"></i>  Image
                </a>
              </li>
              <li className="-mb-px  flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (postSort == 2
                      ? "text-white bg-" + color + "-600"
                      : "text-" + color + "-600 bg-white")
                  }
                  onClick={e => {
                    e.preventDefault();
                    setPostSort(2);
                  }}
                  data-toggle="tab"
                  href="#link3"
                  role="tablist"
                >
                  <i className="fas fa-link text-base mr-1"></i>  Link
                </a>
              </li>
              <li className="-mb-px  flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (postSort == 3
                      ? "text-white bg-" + color + "-600"
                      : "text-" + color + "-600 bg-white")
                  }
                  onClick={e => {
                    e.preventDefault();
                    setPostSort(3);
                  }}
                  data-toggle="tab"
                  href="#link4"
                  role="tablist"
                >
                  <i className="fas fa-list text-base mr-1"></i>  Poll
                </a>
              </li>
            </ul>
           
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">        
          <div >
            <div className="relative w-full mb-3">             
            
              <Input size="lg" color="green" label="Title" className="text-sm block px-3 py-4 text-blueGray-700 rounded "
              value={title}
              onChange={(e)=>{
                var str=e.target.value;
                var pp=str.replace(/[.*+^{}()|[\]\\]/g, '')
                setTitleContent(pp)}} />
              
            </div>
            {postType==2&&(<Abstract abstractDescription={abstractDescription} setAbstractDescription={setAbstractDescription}/>)}
            {(postSort == 0 || postSort == 3)&&(
              <div  className= "relative w-full mb-3"id="link1"  >    
                <div ref={quillRef}  className="rounded"/>        
                    
              </div>
              )}
            
           

           {(postSort == 1 )&&(
              <div className= "relative w-full mb-3" id="link2"  > 
                <ImageUploader style={{ maxWidth: '100%', margin: "20px auto" }}
                                  withPreview={true} 
                                  singleImage={true}
                                  setImage={setPostImg}/>
              </div>
             )}
           {(postSort == 2 )&&(
            <div className= "relative w-full mb-3" id="link2"  > 
              <input className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Url:"
                  type="url"
                  onChange={(e)=>{setLinkUrl(e.target.value)}}
                  required/>
            </div>      
             )}     
            {(postSort ==3)&&(
            <div className="flex-auto px-4  pt-0 border border-0">   
              <label
                  className="block uppercase text-blueGray-600 text-lg font-bold mb-1 mt-4"
                
                >
                 Options
              </label>
              {pollItems.map((pollitem,i)=>{                
                  return(
                  <div key={`option-${i}`}className="relative flex w-full flex-wrap items-stretch mb-3">                    
                    <input type="text" 
                        placeholder="Placeholder" 
                        className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border border-slate-300 outline-none focus:outline-none focus:ring w-full pr-10"                      
                        
                        onChange={(e)=>changePollItem(e.target.value,i)}

                        required/>
                    {(pollItems.length==i+1)&&(  
                    <span className="z-10 h-full leading-snug font-normal  
                    hover:bg-stone-500 hover:text-white active:bg-stone-600
                    absolute text-center text-slate-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-1 py-3"
                      onClick={()=>removePollItem(i)}
                    >
                      <i className="fas fa-trash "></i>
                    </span>
                    )}
                  </div>)

                })

              }                  
              
              
              <div className="text-center flex justify-between mt-4">
                <button className="text-pink-500 background-transparent font-bold uppercase px-8 py-3 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                  onClick={addPollItem}    
                    >
                  <i className="fas fa-plus"></i> Add Options
                </button>
                <div className="flex flex-wrap  py-3">
                  <label className="text-neutral-500 text-sm block px-3 py-3 text-blueGray-700 rounded ">Expire Time</label>
                  <select className="text-neutral-500  font-bold uppercase text-sm h-10" defaultValue="86400"
                        onChange={(e)=>{setExpireTime(e.target.value)}}
                        >
                    <option value="1">1day</option>
                    <option value="2">2days</option>
                    <option value="3">3days</option>
                    <option value="4">4days</option>
                    <option value="5">5days</option>
                    <option value="6">6days</option>

                  </select>
                </div>
              </div>
            </div>
            ) }
            <div className="flex   py-2 border border-0 px-2
            flex mb-0 list-none flex-wrap pt-3 pb-3 flex-row
            ">
              
              {ocState?( 
                <button className="text-neutral-500 border border-neutral-500 hover:bg-neutral-500 hover:text-white active:bg-neutral-500 font-bold uppercase text-sm px-6 py-1 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                      onClick={()=>{setOCState(false)}}
                      >
                + OC
              </button>):(
              <button className="bg-neutral-500 text-white  border active:bg-neutral-500 font-bold uppercase text-sm px-6 py-1 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                         
              onClick={()=>{setOCState(true)}}
                      >
                + OC
              </button>)}
              {spolierState?( 
                <button className="text-neutral-500 border border-neutral-500 hover:bg-neutral-500 hover:text-white active:bg-neutral-500 font-bold uppercase text-sm px-6 py-1 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                      onClick={()=>{setSpolierState(false)}}
                      >
                + Spolier
              </button>):(
              <button className="bg-neutral-500 text-white border active:bg-neutral-500 font-bold uppercase text-sm px-6 py-1 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                          onClick={()=>{setSpolierState(true)}}
                      >
                + Spolier
              </button>)}
              {nsfwState?( 
                <button className="text-neutral-500 border border-neutral-500 hover:bg-neutral-500 hover:text-white active:bg-neutral-500 font-bold uppercase text-sm px-6 py-1 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                      onClick={()=>{setNSFWState(false)}}
                      >
                + NSFW                        
              </button>):(
              <button className="bg-neutral-500 text-white border active:bg-neutral-500 font-bold uppercase text-sm px-6 py-1 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button"
                          onClick={()=>{setNSFWState(true)}}
                      >
                + NSFW
              </button>)}               
     
            </div>
            <div className="flex flex-wrap border border-0">
              <div className="flex  flex-wrap w-full gap-4 py-1">              
                <label className="text-sm block pl-4 py-3 text-blueGray-700 rounded  ">Post Type</label>
                <Radio id="blue"  color="blue" label="Public"value={0} checked={postType==0} onChange={(e)=>{setPostType(e.target.value)}} />
                <Radio id="teal"  color="teal" label="Private" value={1} checked={postType==1} onChange={(e)=>{setPostType(e.target.value)}}/>
                <Radio id="green"  color="green" label="Paid" value={2} checked={postType==2} onChange={(e)=>{setPostType(e.target.value)}}/>         
              </div>
          
              {(postType==1)&&(///private
                <div className="flex flex-wrap w-full  py-1 px-4 mb-3">
                  <Input size="md" color="teal" label="Private Key" className="text-sm block px-3 py-3 text-blueGray-700 rounded " 
                   onChange={(e)=>{setPrivateKey(e.target.value)}}/>
                
                </div>
                // <div className="flex flex-wrap w-full  py-2">
                   
                  
                //   <div className="px-2">
                //     <label className="text-sm block px-3 py-3 text-blueGray-700 rounded ">private key</label>
                //   </div>
                //   <div className="w-8/12 px-4">
                //     <input className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                //       minlength="5"
                //       onChange={(e)=>{setPrivateKey(e.target.value)}}
                //     required/>
                //   </div>
                // </div>
                
                )}
              </div>
          
            <div className="text-center flex justify-between mt-4">
              <h6 className="text-blueGray-700 text-xl font-bold">
               
              </h6>
              <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b">     

                
                {account&&active&&(
                  <button
                    className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-3 ease-linear transition-all duration-150"
                    onClick={()=>{setIsOpenSwitchNetworkModal([true,false,'0'])}}
                  >
                    switch wallet 
                  </button>       
                )}   
                {!account&&(
                  <button
                    className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-3 ease-linear transition-all duration-150"
                    onClick={()=>{setIsOpenSwitchNetworkModal([true,false,'0'])}}
                  >
                    connect wallet 
                  </button>       
                )} 
                {active&&account&&(
                  <button
                    className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-3 ease-linear transition-all duration-150"
                    onClick={onSubmit}
                  
                  >
                    create 
                  </button>       
                )}   
              </div>
            </div>
  
          </div >
        </div>
        
      </div>
    </>
  );
}
