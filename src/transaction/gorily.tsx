import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import Web3 from "web3";
import config from "../config";

const Goeril = () => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);
  const [loading,setLoading]=useState<boolean>(false)

  const [data, setData] = useState<any>({ recipient: "", amount: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainId, setchainId] = useState<number>();
  // const value = Number(data.amount);
  const network='Goerli'

  const createContract = () => {
    web3.setProvider(
      ethereum|| "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );

    const contract = new web3.eth.Contract(
      config.goerli.contractABI,
      config.goerli.contractaddress
    );
    console.log(contract);

    return contract;
  };

  const getchainId = async () => {
    const currentchainid = await web3.eth.getChainId();
    console.log(currentchainid);
    setchainId(currentchainid);
  };
useEffect(()=>{
  
},[])
  const getAddress = async () => {
   
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    await setCurrentAccount(accounts[0]);

    console.log(accounts[0]);
    alert(`accounts:${accounts[0]}`);
    return accounts[0]
  };

  
  const sendTransaction = async () => {
    const currentAddress= await getAddress()
    setLoading(true)
    if (!ethereum) {
      setLoading(false)
      return console.log("please install ethereum");
    } else {
      try {
        const amount=data.amount 
        const value=web3.utils.toWei(data.amount, "ether")
        const recipient=data.recipient
        console.log(data.recipient, value, currentAddress);

        const Contract = createContract();
        console.log(Contract);
         await Contract.methods.transfer(recipient, value).send({ from: currentAddress })
         .then(async(success:any)=>{
          console.log(success.transactionHash);
          const transactionhash =await success.transactionHash
          sendReceipt({recipient,amount,currentAddress,transactionhash})
        }).catch((err:any)=>{
          console.log(err);
          
        })
        
          
      } catch (error) {
        console.log(error);
      }
    }
  };
  const sendReceipt =async ({recipient,amount,currentAddress,transactionhash}:any)=>{
    axios.post('http://localhost:3002/addtransaction',{recipient,amount,currentAddress,transactionhash,network,chainId})
    .then(responce=>{
      console.log(responce.data);
      alert(responce.data.message)
      
      
    })
    .catch(err=>{
      console.log(err);
      
    })
  }

  const submithandler = (e: FormEvent) => {
    e.preventDefault();
    sendTransaction();
  };
  useEffect(() => {
    getchainId();
    
  }, []);
  return (
    <div>
      <div className="w-full text-center mt-3">
        <h1 className="font-bold text-xl">Transaction </h1>
      </div>
      <div className="w-full flex justify-center mt-8">
        <div>
          <form>
            <div>
              <label className="font-bold text-xl">Receptent ADDress :</label>

              <input
                type={"text"}
                name={"recipient"}
                onChange={(e) => {
                  setData({ ...data, recipient: e.target.value });
                }}
                className="border p-3 rounded-lg"
              />
            </div>
            <div className="mt-3">
              <label className="font-bold text-xl">Amount :</label>
              <input
                type={"number"}
                step="0.0001"
                name={"amount"}
                onChange={(e) => {
                  setData({ ...data, amount: e.target.value });
                }}
                className="border p-3 rounded-lg ml-20"
              />
            </div>
            <div className="flex justify-center mt-10 gap-x-10">
              <button
                onClick={submithandler}
                className="bg-black p-4  rounded-lg text-white"
              >
                send
              </button>
              <button
                onClick={getAddress}
                className="bg-black p-4  rounded-lg text-white"
              >
                getAddress
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Goeril;
