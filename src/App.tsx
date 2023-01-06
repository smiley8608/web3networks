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
      
      
      </>:<>{
        (BSCTestnet === chainid)?<>
        <BSCNetwork />
        
        </>:<>
        these Network are not available</>

      }
      </>
      }
    </div>
  );
}

export default App;
