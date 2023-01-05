import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import Web3 from "web3";
import config from "../config";
import convert from "../functions/convert";
// import { ethers } from "ethers";

const BSCNetwork = () => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);
  const BSCTestnet = 97;
  const network = "BSCTestNet";
  const [data, setData] = useState<any>({});
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainId, setchainId] = useState<number>();

  const createContract = async () => {
    await web3.setProvider(ethereum||"https://data-seed-prebsc-1-s1.binance.org:8545/");

    // console.log(ethereum);

    const contract = new web3.eth.Contract(
      config.bsc.contractABI,
      config.bsc.contractaddress
    );
    // console.log(contract);

    return contract;
  };

  const getchainId = async () => {
    const currentchainid = await web3.eth.getChainId();
    // alert(`chain_id:${currentchainid}`);
    setchainId(currentchainid);
  };

  const getAddress = async () => {
    if (!ethereum) {
      return console.log("Connectionerror");
    } else {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      localStorage.setItem("connectAddress", accounts[0]);
      alert(`Addresss:${accounts}`);
      return accounts[0];
    }
  };

  const sendTransaction = async () => {
    const currentAddress = await getAddress();
    if (!ethereum) {
      return console.log("please install metamask");
    } else {
      try {
        // console.log(data.recipient, typeof data.amount);
        const recipient = data.recipient;
        const amount=data.amount
        console.log(currentAddress);
        
        const value = web3.utils.toWei(data.amount, "ether");

        const Contract = await createContract();
        console.log(Contract);
        console.log(recipient);
        console.log(value);
        await Contract.methods
          .transfer(recipient, value)
          .send({ from: currentAddress })
          .then(async(sucess: any) => {
            console.log(sucess);
            console.log(sucess.transactionHash);
            const transactionhash=await sucess.transactionHash
            sendReceipt({recipient,amount,currentAddress,transactionhash});
          })
          .catch((err: any) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const sendReceipt = ({recipient,amount,currentAddress,transactionhash}:any) => {
    axios
      .post('http://localhost:3002/addtransaction', {recipient,amount,currentAddress,transactionhash,network,chainId})
      .then((responce) => {
        console.log(responce.data);
        alert(responce.data.message)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submithandler = (e: FormEvent) => {
    e.preventDefault();
    if (!data.recipient || !data.amount) {
      return console.log("error");
    } else {
      sendTransaction();
    }
  };
  useEffect(() => {
    getchainId();
    // getAddress()
  }, []);
  return (
    <div>
      <div className="w-full text-center mt-3">
        <h1 className="font-bold text-xl">BSC Transaction </h1>
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
            <div className="flex justify-center mt-10 gap-x-14">
              <button className="bg-black p-4  rounded-lg text-white">
                ClickMe
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
export default BSCNetwork;
