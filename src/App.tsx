import React, { useEffect, useState } from 'react';

import Connectnetworks from './component/connectnetworks';
import ImportToken from './component/importtokens';
import BSCToken from './component/BSCToken';
import Goeril from './transaction/gorily';
import BSCNetwork from './transaction/BSCnetwork';
import Web3 from 'web3';

function App() {
  const GoerliTestnet = 5;
  const BSCTestnet = 97;
  const {ethereum}:any=window
  const web3=new Web3(ethereum)
  const [chainid,setChainId]=useState<number>()
  const getChain= async()=>{

    const chainId= await web3.eth.getChainId()
    console.log('app',chainId);
    // alert(`chain_id:${chainid}`)
    setChainId(chainId)
  }

  useEffect(()=>{
    getChain()

  },[setChainId])
  return (
    <div>
      <Connectnetworks setchainId={setChainId} />
    
      {
      (GoerliTestnet ===chainid)?<>
      <Goeril />
      <ImportToken address={"0x29B53aaABD2CAc4e1104bE1373D5B5aba9a4507A"}/>
      
      </>:<>{
        (BSCTestnet === chainid)?<>
        <BSCNetwork />
        <BSCToken address={"0x4B4Bf5D871Cf6eC659F6a16fe9129f8F1EdF27d3"} />
        </>:<>
        these Network are not available</>

      }
      </>
      }
    </div>
  );
}

export default App;
