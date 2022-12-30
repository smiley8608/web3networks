import { FormEvent, useEffect, useState } from "react";
import Web3 from "web3";
import config from "../config";
// import { ethers } from "ethers";

const BSCNetwork = () => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);

  const [data, setData] = useState<any>({});
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainId, setchainId] = useState<number>();

  const createContract = async () => {
    await  web3.setProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
    
    // console.log(ethereum);
    
    const contract = new web3.eth.Contract(config.bsc.contractABI,config.bsc.contractaddress)
    // console.log(contract);

    return contract;
  };

  const getchainId = async () => {
    const currentchainid = await web3.eth.getChainId();
    console.log(currentchainid);
    setchainId(currentchainid);
  };

  const getAddress = async () => {
    if(!ethereum){
        return console.log('Connectionerror')
    }else{
        const Contract = createContract()
        console.log(Contract);
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setCurrentAccount(accounts[0]);
      };
    }




  const sendTransaction = async () => {
    
    if (!ethereum) {
      return console.log("please install metamask");
    } else {
      try {
        console.log(data.recipient, data.amount);

        const Contract = await createContract()
        console.log(await Contract.methods.transfer(data.recipient, data.amount).call());
        // const parsedAmount= web3.utils.toHex(data.amount)
         const contractData = await Contract.methods.transfer(data.recipient, data.amount).call((err:any,txhash:any)=>{
            if(err){
                console.log(err);
                
            }else{
                console.log(txhash);
                
                return txhash
            }
            
         })
        // await ethereum.request({
        //   method: "eth_sendTransaction",
        //   params: [
        //     {
        //       from: currentAccount,
        //       to: config.bsc.contractaddress,
        //       gas: "0x5208",
        //       data: contractData,
        //     },
        //   ]
        // });
        console.log(contractData);
        

        //    const transactionhash= await transaction.wait()
        //    alert(`success : ${transaction.hash}`)
      } catch (error) {
        console.log(error);
      }
    }
  };

  const submithandler = (e: FormEvent) => {
    e.preventDefault();
    if(!data.recipient||!data.amount ){

        return console.log('error');
        
    }else{
        sendTransaction()
    }
    
  };
  useEffect(() => {
    // getchainId();
    
  }, []);
  return (
    <div>
      <div className="w-full text-center mt-3">
        <h1 className="font-bold text-xl">Transaction </h1>
      </div>
      <div className="w-full flex justify-center mt-8">
        <div>
          <form onSubmit={submithandler}>
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
            <button className="bg-black p-4 h-5 mt-14 ml-7">ClickMe</button>
          </form>
        </div>
      </div>
      <button onClick={getAddress}>getAddress</button>
    </div>
  );
};
export default BSCNetwork;
