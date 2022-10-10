import React,{useEffect,useState} from "react";

// components
import ImageUploader from "../../../components/ImageUpload/index.js";
import  {jsonDataUploadtoIpfs,
  imageUploadtoIpfs} from "../../../ipfs/ipfs"
import {
  getWriteContract,

  editCommunityChannel} from "../../../Web3Api/Web3"
import { ErrorToast, SuccessToast } from "../../toast/toast.js";
import { PopoverPicker } from "../ColorPicker/PopoverPicker";
export default function CardSettings({account, active,chainId, channelDBInf, setSubmitting, channelInf,setIsOpenSwitchNetworkModal}) {
  
  
  const MyBoradContract=getWriteContract(chainId,account,active,'myboard')
  const [changeState,setChangeState]=useState(false)
  const [bannerColor,setBannerColor]=useState("#3423f2");
  const [themeColor, setThemecolor]=useState("#3423f2");
  const [bannerHeight,setBannerHeight]=useState(64);
  const [iconImage,setIconImg]=useState(null);///profileimage
  const [coverImg,setCoverImg]=useState(null);////profileCoverImage
  const [iconImg_urls,setIconImgUrls]=useState([]);
  const [coverImgChanged, setCoverImgChanged]=useState(false);
  const [iconImgChanged, setIconImgChanged]=useState(false);
  const [coverImg_urls,setCoverImgUrls]=useState([]);
  useEffect(()=>{
    setBannerColor(channelInf.inf.appearance.bannerColor)
    setBannerHeight(channelInf.inf.appearance.bannerHeight)
    setThemecolor(channelInf.inf.appearance.themeColor)
   
    if(channelInf.inf.appearance.iconImg_Url!=""){
    
      setIconImgUrls([`https://ipfs.io/ipfs/${channelInf.inf.appearance.iconImg_Url}`])
    
    

    }
    if(channelInf.inf.appearance.coverImg_Url!=""){
   
      setCoverImgUrls([`https://ipfs.io/ipfs/${channelInf.inf.appearance.coverImg_Url}`])

    }
  },[channelInf])



 ////////posting function
  async function uploadPostDataToIpfs(){
    setSubmitting("uploadingToIpfs");   
   
    var _content=channelInf.inf;
    var _iconimage_url=_content.appearance.iconImg_Url;
    var _coverimage_url= _content.appearance.coverImg_Url;    
    
    if(iconImgChanged){
      if(iconImage){
       
        _iconimage_url=await imageUploadtoIpfs(iconImage);
      }else{
        _iconimage_url='QmU6cH3ZUtbW474bQrCK7dXuEqxVnFQqXgnTjBRiMZgikN';
      }
    }
    if(coverImgChanged){
      
      if(coverImg){
       
        _coverimage_url=await imageUploadtoIpfs(coverImg);
      }else{
        _coverimage_url=''
      }
    }
   
    _content.appearance.bannerColor=bannerColor;
    _content.appearance.bannerHeight=bannerHeight;
    _content.appearance.themeColor=themeColor;
    _content.appearance.iconImg_Url=_iconimage_url;
    _content.appearance.coverImg_Url=_coverimage_url;
    
    
    var _contentUrl=  await jsonDataUploadtoIpfs(_content);  
        
   
    return [_contentUrl,_iconimage_url]
  }
  async function SaveSettingChange(){  
    if(!account||!active||channelDBInf.chainId!=chainId){
      console.log(channelDBInf.chainId,chainId)
      setIsOpenSwitchNetworkModal([true,true,channelDBInf.chainId.toString()]);
      return
    } 
    setSubmitting("uploadingToIpfs")
    var [_contentUrl,_iconimage_url]=await uploadPostDataToIpfs();   
   
    if(!_contentUrl||!_iconimage_url){
      console.log(!_contentUrl,!_iconimage_url) 
      ErrorToast("Upload to IPFs Failed")
      return
    }
    setSubmitting("saving")    
    var _content=channelInf.inf;
    var topics_str="no"
    if(_content.topics.length>0){
      topics_str=_content.topics.toString()
    }
    var res=await editCommunityChannel(chainId,MyBoradContract,account,channelInf.channelId,_contentUrl,_iconimage_url,topics_str)
    if(res=="success"){
      SuccessToast("Saved successfully!")
      setChangeState(false)
    }else{
      ErrorToast("Upload to IPFs Failed")
    }
    setSubmitting("ready") 
   
  }

  const [color, setColor] = useState("#aabbcc");
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-green-600 mb-0 px-6 py-4">
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold">Appearance</h6>
            {changeState&&(
              <button type="button" 
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-10 py-2.5 text-center mr-2 mb-2 pr-6 pl-6 focus:outline-none"
              onClick={SaveSettingChange}
              >
                Save
              </button>
            )}
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          
          <form >
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              SELECT  color 
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                   select theme color 
                  </label>
                  <PopoverPicker color={themeColor} setColor={setThemecolor} setChangeState={setChangeState} />
                  
                </div>
              </div>
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                   select banner color 
                  </label>
                  <PopoverPicker color={bannerColor} setColor={setBannerColor} setChangeState={setChangeState} />
                 
                </div>
              </div>
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select a banner Height</label>
                  <div className="flex items-center">
                      <input id="default-radio-1" type="radio" value="64" name="default-radio" 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:border-gray-600"
                      checked={bannerHeight==64}
                      onChange={(e)=> {setBannerHeight(e.target.value);setChangeState(true);}}
                      />
                      <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">small-
                      64px</label>
                  </div>
                  <div className="flex items-center">
                      <input  id="default-radio-2" type="radio" value="128" name="default-radio"
                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:border-gray-600"
                       checked={bannerHeight==128}
                       onChange={(e)=> {setBannerHeight(e.target.value);setChangeState(true);}}
                       />
                      <label  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">medium-128px</label>
                  </div>
                  <div className="flex items-center">
                      <input  id="default-radio-2" type="radio" value="192" name="default-radio" 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300   dark:border-gray-600"
                      checked={bannerHeight==192}
                      onChange={(e)=> {setBannerHeight(e.target.value);setChangeState(true);}}/>
                      <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">large-192px</label>
                  </div>          
                </div>
              </div>
         
          
            </div>
            <div className="flex flex-wrap">
            
             </div>
            <hr className="mt-6 border-b-1 border-blueGray-300" />
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              select Image Image
            </h6>
            <div className="flex flex-wrap">
      
              <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Select Community Icon IMage
                  </label>
                  <ImageUploader style={{ maxWidth: '100%', margin: "10px auto" }}
                        withPreview={true} 
                        singleImage={true}
                        setImage={setIconImg}
                        onChange={(e)=>{setChangeState(true);setIconImgChanged(true);}}
                        defaultImages={iconImg_urls}
                        />
                </div>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Select Community background image
                  </label>
                  <ImageUploader style={{ maxWidth: '100%', margin: "10px auto" }}
                        withPreview={true} 
                        singleImage={true}
                        setImage={setCoverImg}
                        onChange={(e)=>{setChangeState(true);setCoverImgChanged(true);}}
                        defaultImages={coverImg_urls}
                        />
                </div>
              </div>
        
            </div>
        


            {/* <div className="text-center mt-6">
              <button
                className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                Create Account
              </button>
            </div> */}

      
          </form>
         
        </div>
      </div>
    </>
  );
}
