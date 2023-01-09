import { Backdrop, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import Web3 from "web3";
import BSCToken from "../component/BSCToken";
import config from "../config";
import convert from "../functions/convert";
import TransactionHistory from "../functions/transactionHistory";
// import { ethers } from "ethers";

const BSCNetwork = () => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);
  const BSCTestnet = 97;
  const [loading,setLoading]=useState<boolean>(false)
  const network = "BSCTestNet";
  const [data, setData] = useState<any>({});
  const [currentAccount, setCurrentAccount] = useState("");
  const [Transaction, setTransaction] = useState();
  const [chainId, setchainId] = useState<number>();

  const createContract = async () => {
    await web3.setProvider(
      ethereum || "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );

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
      console.log("Connectionerror");
      return console.log("Connectionerror");
    } else {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      localStorage.setItem("connectAddress", accounts[0]);
      alert(`Addresss:${accounts}`);
      console.log(accounts[0]);
      
      return accounts[0];
    }
  };

  const sendTransaction = async () => {
    const currentAddress = await getAddress();
    if (!ethereum) {
      return console.log("please install metamask");
    } else {
      try {
        const recipient = data.recipient;
        console.log(currentAddress===recipient);
        
        
        console.log('runnrs');
        // console.log(data.recipient, typeof data.amount);
        if(Number(currentAddress)===Number(recipient)){
          alert('sender and reciver canot be same')
return
        }else{
          setLoading(true)

          const amount = data.amount;
          console.log(currentAddress);
  
          const value = web3.utils.toWei(data.amount, "ether");
  
          const Contract = await createContract();
          console.log(Contract);
          console.log(recipient);
          console.log(value);
          await Contract.methods
            .transfer(recipient, value)
            .send({ from: currentAddress })
            .then(async (sucess: any) => {
              console.log(sucess);
              console.log(sucess.transactionHash);
              const transactionhash = await sucess.transactionHash;
              sendReceipt({ recipient, amount, currentAddress, transactionhash });
              setLoading(false)
            })
            .catch((err: any) => {
              console.log(err);
            });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const sendReceipt = ({
    recipient,
    amount,
    currentAddress,
    transactionhash,
  }: any) => {
    axios
      .post("http://localhost:3002/addtransaction", {
        recipient,
        amount,
        currentAddress,
        transactionhash,
        network,
        chainId,
      })
      .then((responce) => {
        console.log(responce.data);
        alert(responce.data.message);
        window.location.reload();
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
    if (chainId) {
      axios
        .get(`http://localhost:3002/gethistory/?chain=${chainId}`)
        .then((responce) => {
          console.log(responce.data.Transaction);
          setTransaction(responce.data.Transaction);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [chainId]);
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
            <Button
                onClick={submithandler}
                className="bg-black p-4  rounded-lg text-white" 
              >
                Send
              </Button>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
                // onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
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
      <div className="mt-4">
        <BSCToken address={"0x4B4Bf5D871Cf6eC659F6a16fe9129f8F1EdF27d3"} />
      </div>
      <div className="mt-3">
        <TransactionHistory  />
      </div>
    </div>
  );
};
export default BSCNetwork;
