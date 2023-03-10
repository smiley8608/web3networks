import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import Web3 from "web3";
import ImportToken from "../component/importtokens";
import config from "../config";
import TransactionHistory from "../functions/transactionHistory";
import { Backdrop, Button, CircularProgress } from "@mui/material";

const Goeril = () => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);
  const [loading, setLoading] = useState<boolean>(false);

  const [data, setData] = useState<any>({ recipient: "", amount: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [chainId, setchainId] = useState<number>();
  // const value = Number(data.amount);
  const network = "Goerli";

  const createContract = () => {
    web3.setProvider(
      ethereum || "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
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
  useEffect(() => {
    getchainId();
    // if(chainId){

    //   axios.get(`http://localhost:3002/gethistory/?chain=${chainId}`)
    //   .then(responce=>{
    //     console.log(responce.data.Transaction);
    //     setTransaction(responce.data.Transaction)

    //   }).catch(error=>{
    //     console.log(error);

    //   })
    // }else{
    //   return console.log('canot find chainId');

    // }
  }, [chainId]);
  const getAddress = async () => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    await setCurrentAccount(accounts[0]);

    console.log(accounts[0]);
    alert(`accounts:${accounts[0]}`);
    return accounts[0];
  };

  const sendTransaction = async () => {
    const currentAddress = await getAddress();
    if (!ethereum) {
      setLoading(false);
      return console.log("please install ethereum");
    } else {
      try {
        const recipient = data.recipient;
        console.log(Number(currentAddress) === Number(data.recipient));
        
        if (Number(currentAddress) === Number(data.recipient)) {
          return alert("Sender and reciver canot be same");
        } else {
          // setLoading(true);
          setLoading(true);
          const amount = data.amount;
          const value = web3.utils.toWei(data.amount, "ether");
          console.log(data.recipient, value, currentAddress);

          const Contract = createContract();
          console.log(Contract);
          await Contract.methods
            .transfer(recipient, value)
            .send({ from: currentAddress })
            .then(async (success: any) => {
              console.log(success.transactionHash);
              const transactionhash = await success.transactionHash;
              sendReceipt({
                recipient,
                amount,
                currentAddress,
                transactionhash,
              });
              setLoading(false);
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
  const sendReceipt = async ({
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
      .catch((err) => {
        console.log(err);
      });
  };

  const submithandler = (e: FormEvent) => {
    e.preventDefault();
    sendTransaction();
  };
  useEffect(() => {}, []);
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
        <ImportToken address={"0x29B53aaABD2CAc4e1104bE1373D5B5aba9a4507A"} />
      </div>
      <div className="mt-3">
        <TransactionHistory />
      </div>
    </div>
  );
};
export default Goeril;
