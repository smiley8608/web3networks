import { useEffect, useState } from "react";
import Web3 from "web3";

const Connectnetworks = ({setchainId}:any) => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);
  const GoerliTestnet = 5;
  const BSCTestnet = 97;
  const PolygonTestnet = 80001;
  const EthereumMainnet = 1;

  const [currentAccount, setCurrentAccount] = useState<any>();

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
    console.log(`currentchain id: ${currentchainid}`);

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
        setchainId(chainId)
        const accounts = await web3.givenProvider.request({
          method: "eth_requestAccounts",
        });
        //  alert(accounts);

        setCurrentAccount(accounts[0]);
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
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            });
            setchainId(PolygonTestnet)
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("error code not equal to 4902");
        }
      }
    } else {
      return alert("You are in the same Network");
    }
  };
  
  const logout = async () => {
    const accounts = await web3.givenProvider.request({
      method: "eth_accounts",
    });
    if (accounts.length) {
    }
    console.log(accounts);

    setCurrentAccount(accounts[0]);
  };
  useEffect(() => {
    getCurrentchainId();
  }, []);
 
  return (
    <div className="w-full p-3 bg-slate-700 flex justify-end gap-5 ">
      <button onClick={() => connectwallet(GoerliTestnet)} className='bg-blue-700 rounded-full p-4 active:bg-yellow-400  '>goreli</button>
      <button onClick={() => connectwallet(BSCTestnet)} className='bg-blue-700 rounded-full p-4 active:bg-yellow-400  '>bsc-testnet</button>
      <button onClick={() => connectwallet(EthereumMainnet)} className='bg-blue-700 rounded-full p-4 active:bg-yellow-400  '>
        Ethereum Mainnet
      </button>
      <button onClick={() => connectwallet(PolygonTestnet)} className='bg-blue-700 rounded-full p-4 active:bg-yellow-400  '>
        PolygonTestNet
      </button>
      {/* <button onClick={() => logout()}>LogOut</button> */}
      
    </div>
  );
};
export default Connectnetworks;
