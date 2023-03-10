import { use } from "chai";
import { useEffect, useState } from "react";
import Web3 from "web3";



const ImportToken = ({ address }: any) => {
  const contractABI: any = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "delegate",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "delegate",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "numTokens",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "tokenOwner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "numTokens",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "numTokens",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const GoerliTestnet= 5;
  const { ethereum }: any = window;
  const web3 = new Web3(
  ethereum
    );
  const getAToken = async () => {
    web3.setProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')
    const contract = new web3.eth.Contract(contractABI, address);

    const [name, symbol, decimals] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
    ]);
    setToken({ name, symbol, decimals });
    console.log([name, symbol, decimals]);
  };
  const addToken = async (chainId:any) => {
    setLoading(true);
    try {
      if (!ethereum) {
        return console.log("please install matamask");
      } else {
        const currentchainid =await web3.eth.getChainId()
        console.log("currentchain",currentchainid);
        
        if(currentchainid !==chainId){
          await ethereum.request({method:'wallet_switchEthereumChain',params:[{
            chainId:web3.utils.toHex(chainId)
          }]})
          await ethereum.request({ method: "wallet_watchAsset", params: {
            type:'ERC20',
            options:{
              address,
              symbol:token.symbol,
              decimals:token.decimals
            }
          } });
          await ethereum.request({ method: "eth_requestAccounts" });
        }else{
          await ethereum.request({ method: "eth_requestAccounts" });
          await ethereum.request({ method: "wallet_watchAsset", params: {
              type:'ERC20',
              options:{
                  address,
                  symbol:token.symbol,
                  decimals:token.decimals
              }
          } });

        }
        
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getAToken();
  }, []);
  return (
    <div>
      <div className="flex justify-center mt-10">
      <button onClick={()=>addToken(GoerliTestnet)} disabled={loading ||!Boolean(token)} className="bg-black p-4  rounded-lg text-white">{(token && `Add ${token.name}`)|| 'loading...'}</button>

      </div>
    </div>
  );
};

export default ImportToken;
