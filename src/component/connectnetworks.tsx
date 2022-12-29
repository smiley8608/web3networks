import { useEffect } from "react";
import Web3 from "web3";

const Connectnetworks = () => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);
  const GoerliTestnet = 5;
  const BSCTestnet = 97;
  const PolygonTestnet = 80001;
  const EthereumMainnet=1;

  
  const connectwallet = async (chainId: any) => {
    console.log(chainId);

    if (!ethereum) {
      console.log("please install metamask wallet");
    } else {
      await ethereum.request({ method: "eth_requestAccounts" });
      await switchNetworks(chainId);
    }
  };

  const getCurrentchainId = async () => {
    const currentchainid = await web3.eth.getChainId();
    console.log(`current chain id: ${currentchainid}`);

    return currentchainid;
  };
  const switchNetworks = async (chainId: any) => {
    const currentchainid = await web3.eth.getChainId();
    console.log(`current chain id: ${currentchainid}`);;

    if (currentchainid !== chainId) {
      try {
        await web3.givenProvider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: web3.utils.toHex(chainId),
            },
          ],
        });
       
      } catch (error: any) {
        // console.log(error);
        if (error.code === 4902) {
          try {
            await web3.givenProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: web3.utils.toHex(PolygonTestnet), // A 0x-prefixed hexadecimal string
                  chainName: "Matic Testnet RPC",
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC", // 2-6 characters long
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                  
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("error code not equal to 4902");
        }
      }
    }
  };
  useEffect(()=>{
    getCurrentchainId()
  },[])
  //   const PolygonDetails={
  //     chainId: web3.utils.toHex(PolygonTestnet), // A 0x-prefixed hexadecimal string
  //   chainName: 'Polygon Mainnet',
  //   nativeCurrency: {
  //     name: 'MATIC',
  //     symbol: 'MATIC', // 2-6 characters long
  //     decimals: 18,
  //   },
  //   rpcUrls:['https://rpc-mumbai.maticvigil.com'],
  //   blockExplorerUrls: ['https://polygonscan.com'],
  //   iconUrls: [''],
//   Network name
// Matic Testnet RPC
// Network URL
// https://rpc-mumbai.maticvigil.com
// Chain ID
// 80001
// Currency symbol
// MATIC
// Block explorer URL
// https://mumbai.polygonscan.com/
  //   }

  return (
    <div>
      <button onClick={() => connectwallet(GoerliTestnet)}>goreli</button>
      <button onClick={() => connectwallet(BSCTestnet)}>bsc-testnet</button>
        <button onClick={()=>connectwallet(EthereumMainnet)}>Ethereum Mainnet</button>
      <button onClick={() => connectwallet(PolygonTestnet)}>PolygonTestNet</button>
    </div>
  );
};
export default Connectnetworks;
