//export const  backenddomain="https://mymessage.io";
 export const  backenddomain="http://localhost";

const contractAddresses={
  "mbase":{
            mesa:"0x76e1C2ce6997A4C129Df88e0189bB9b5D3B5E349",
            myboard:"0x6Ac9AbeCe81Ce862470dF113faCcD6FA56884228",           
            startblock:2914340 ,     
          },
  "mumbai":{
          mesa:"0x9E5EAFeD952136C87eaB9D29ab64D6e63534E091",
          myboard:"0xFF094223dE5A5C028aD0d5161Cb86206Be45cF86",           
          startblock:28779108 ,
          },
  "testbsc":{
          mesa:"0x067a37347f4188a0e16759303827d8143e0Ff0Df",
          myboard:"1",           
          startblock:23970859,
    },
  "moonbeam":{
          mesa:"0xcFE133cD392f36DA41d287E78316b8fBba51f8DA",
          myboard:"1",  //"0xb7f2388d2DAC68Bf205C6FbA52AD3FBf36855225"         
          startblock:2144508,
  },
  "polygon":{
          mesa:"1",
          myboard:"1",           
          startblock:11234213,
  },
  "bsc":{
        mesa:"0xb192d5fC358D35194282a1a06814aba006198010",
        myboard:"1",  //0x838e0Bc17E55D0C0CBEcF09b37CD98529289c633         
        startblock:22440994,
  },
}
export {contractAddresses};


export const networkNames={
  "1287":"mbase",
  "80001":"mumbai",
  "137":"polygon",
  "1284":"moonbeam",
  "97":"testbsc",
  "56":"bsc"
}
export const networkChainIds={
  "mbase":"1287",
  "mumbai":"80001",
  "polygon":"137",
  "moonbeam":"1284",
  "testbsc":"97",
  "bsc":"56"
}
export const chainScanUrls={
  "mbase":"https://moonbase.moonscan.io/",
  "mumbai":"https://mumbai.polygonscan.com/",
  "bsc":"https://bscscan.com/",
  "testbsc":"https://testnet.bscscan.com/",
  "polygon":"https://polygonscan.com/",
  "moonbeam":"https://moonbeam.moonscan.io/"

}

export const rpc_urls={
  "mbase":"https://rpc.api.moonbase.moonbeam.network",
  "mumbai":"https://matic-mumbai.chainstacklabs.com",
  "bsc":"https://bsc-dataseed.binance.org/",
  "testbsc":"https://bsctestapi.terminet.io/rpc",
  "polygon":"https://polygonapi.terminet.io/rpc",
  "moonbeam":"https://rpc.ankr.com/moonbeam"
}
export const mesa_Abi = require('../contract/abis/mesa.json');
const myboard_Abi = require('../contract/abis/myboard.json');

export const Abis={
  "mesa":mesa_Abi,
  "myboard":myboard_Abi, 
}


export const InjectedchainIds=[1287,80001,137,1284,97,56];




const privatePostCreatePayAmount=500;
const paidContentCreatePayAmount=500;
const viewPaidContentPayAmount=100;
const awardTokenAmount=100;
export {privatePostCreatePayAmount,paidContentCreatePayAmount,viewPaidContentPayAmount,awardTokenAmount}

export const importNetworksParams={
  mbase:{
    chainId: "0x507",
    chainName: "Moonbase Alpha",
    rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
    nativeCurrency: {
      name: "DEV",
      symbol: "DEV",
      decimals: 18,
          },
    blockExplorerUrls:["https://moonbase.moonscan.io"],
  },
  mumbai:{
    chainId: "0x13881",
    chainName: "Mumbai",
    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
          },
    blockExplorerUrls:["https://mumbai.polygonscan.com"],
  },
  testbsc:{
    chainId: "0x61",
    chainName: "BNB Testnet",
    rpcUrls: ["https://data-seed-prebsc-2-s2.binance.org:8545"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
          },
    blockExplorerUrls:["https://testnet.bscscan.com"],
  },
  polygon:{
    chainId: "0x89",
    chainName: "Polygon",
    rpcUrls: ["https://polygon-rpc.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
          },
    blockExplorerUrls:["https://polygonscan.com"],
  },
  moonbeam:{
    chainId: "0x504",
    chainName: "Moonbeam",
    rpcUrls: ["https://rpc.api.moonbeam.network"],
    nativeCurrency: {
      name: "GLMR",
      symbol: "GLMR",
      decimals: 18,
          },
    blockExplorerUrls:["https://moonbeam.moonscan.io"],
  },
  bsc:{
    chainId: "0x38",
    chainName: "Smart Chain",
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
          },
    blockExplorerUrls:["https://bscscan.com/"],
  },
}

// export const activeChainIds=[56,1284]
export const activeChainIds=[1287,80001,137,1284,97,56]

//dweb:/ipfs/QmSpj3GGNE5jBwH1bWQimzXPt8s5oozhHPTSeS9ZFm4ZKa