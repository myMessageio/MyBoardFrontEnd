
import axios from 'axios';
import { NFTStorage,  Blob } from 'nft.storage'
const CryptoJS = require("crypto-js");
const crypto = require('crypto');
const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGYwOWY2MjAxNGQ0RDNBMTZBMDhiNGU3ZDNiNjFERWZiZTRmZDUwNjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTIxNzcyMDI2NywibmFtZSI6IkRhdGFQb3J0YWwifQ.fcKrHxE03Qk6_zoq57b4Qs1wps-K0O6snGYNxy5SxA4'
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN })

export async function imageUploadtoIpfs(file){
  try {
    const cid = await client.storeBlob(file)
    return cid
  
  } catch (error) {
  
   return null;
  }  
}
export async function imageEncryptUploadtoIpfs(file,callback){
  try {
    const reader = new FileReader();
     reader.readAsArrayBuffer(file);   
    reader.onload =async function() {   
      try{
        console.log(reader.result)
        var base64Key = crypto.randomBytes(8).toString('hex');         
        var key = CryptoJS.enc.Base64.parse(base64Key);   
        let content = CryptoJS.lib.WordArray.create(reader.result);       
        let encrypted = CryptoJS.AES.encrypt(content, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });   
        var fileEnc = new Blob([encrypted.toString()]);   
        const cid = await client.storeBlob(fileEnc)
        // contentObj.samplefile_cid=samplefile_cid
        // contentObj.mainfile_cid=mainfile_cid
        // const contentBlob = new Blob([JSON.stringify(contentObj)], { type: 'application/json' })
        // const nftcid= await client.storeBlob(contentBlob)

        // const updateBlob=new Blob([JSON.stringify(updateObj)], { type: 'application/json' })        
        // const updateCid=await client.storeBlob(updateBlob)  
        console.log(cid,base64Key);   
        callback(cid,base64Key)         
   
      }catch(e){
        callback(null,null)         
      }
   
    

    };
  
    reader.onerror = function() {
      console.log(reader.error);
      return [null,null]         
    };
 

  } catch (err) {
    console.log(err)
    
  }

}

export async function mainDataEncryptUploadToIpfs(content,callback){
  try{
    var base64Key = crypto.randomBytes(8).toString('hex');         
    var key = CryptoJS.enc.Base64.parse(base64Key);  
    let encrypted = CryptoJS.AES.encrypt(content, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });     
    const contentBlob = new Blob([encrypted.toString()], { type: 'application/json' })
    const cid= await client.storeBlob(contentBlob)

    callback(cid,base64Key)         
    
  }catch(e){
    callback(null,null)         
  }   
}
export async function imageDecryptUrl(cid,base64Key){
 
     
  try{
  var fetchText=await fetchIPFSText(cid)      

 
  var key = CryptoJS.enc.Base64.parse(base64Key);
  const decryptedRaw = CryptoJS.AES.decrypt(fetchText, key,{
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });


  var fileDec = new Blob([convertWordArrayToUint8Array(decryptedRaw)]);                                   // Create blob from typed array

    // var a = document.createElement("a");
    var url = window.URL.createObjectURL(fileDec);
    // console.log(url)
    // var filename =  filename;
    // a.href = url;
    // a.download = filename;
    // a.click();
    // window.URL.revokeObjectURL(url);
    return url

  }
  catch(e){
    console.log(e);
    return "";
  }
}

export async function mainDecryptData(cid,base64Key){
    var ciphertext=await fetchIPFSText(cid)
    var key = CryptoJS.enc.Base64.parse(base64Key);  
    var bytes  = CryptoJS.AES.decrypt(ciphertext, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }); 
    
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));   
    return decryptedData

}




export async function jsonDataUploadtoIpfs(contentObj){
  try {

    const contentBlob = new Blob([JSON.stringify(contentObj)], { type: 'application/json' })
    const cid= await client.storeBlob(contentBlob)   
    return cid
  
  } catch (error) {
    console.log(error)
   return  null;
  }  
}


export  async function getDataFromIpfs(url){ 
var pp= await axios({
    method: 'get',
    url: `https://ipfs.io/ipfs/${url}`,
  
  })

  return pp;

    // .then(function(response) {    
    //   fallback(response.data)
     
  //});
  // try {

  //   const stream = client.cat(url)
  //   let data = ''
  //   console.log(`https://ipfs.infura.io/ipfs/${url}`);
  //   for await (const chunk of stream) {
  //     // chunks of data are returned as a Buffer, convert it back to a string
  //     // console.log(chunk);
  //     data += chunk.toString()
  //   }
    
  //   // console.log(data)
  //   return data
  
  // } catch (error) {
  //  return [];
  // }  
}

// export function getDatafromIpfs(url){
//   axios({
//     method: 'get',
//     url: `https://ipfs.infura.io/ipfs/${url}`,
//     responseType: 'stream'
//   })
//     .then(function(response) {
//       console.log(response.data)
//   });
// }

export async function fetchIPFSText(ipfsHashUrl) { /////ipfs comback function 
  const response = await fetch(`https://ipfs.io/ipfs/${ipfsHashUrl}`);  
    // ,{
    //   meothod:'get',
    // mode: 'no-cors',
    // header: {
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin':'*',
    // }}
    
  return await response.text();
}

function convertWordArrayToUint8Array(wordArray) {
  var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
  var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
  var uInt8Array = new Uint8Array(length), index=0, word, i;
  for (i=0; i<length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
  }
  return uInt8Array;
}
