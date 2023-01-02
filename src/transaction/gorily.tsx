import { FormEvent, useEffect, useState } from "react";
import Web3 from "web3";
import config from "../config";

const Goeril = () => {
  const { ethereum }: any = window;
  const web3 = new Web3(ethereum);

  const [data, setData] = useState<any>({ recipient: "", amount: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainId, setchainId] = useState<number>();

  const createContract = () => {
    web3.setProvider(
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
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

  const getAddress = async () => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
    // alert(`accounts:${currentAccount}`);
  };
  const sendTransaction = async () => {
    if (!ethereum) {
      return console.log("please install ethereum");
    } else {
      try {
        const value = Number(data.amount);
        console.log( data.recipient,data.amount,currentAccount);

        const Contract = createContract();
        console.log(Contract);
        // const contractdata = await Contract.methods
        //   .transfer(data.recipient, web3.utils.fromWei(data.amount, "wei"))
        //   .call({ from: currentAccount });
        // console.log(contractdata);
       const transactionhash= await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: config.goerli.contractaddress,
              gas: String(0x5208),
              data: Contract.methods
                .transfer(
                  data.recipient,
                  web3.utils.fromWei(data.amount, "wei")
                )
                .encodeABI(),
              chainId: chainId,
            },
          ],
        });
        console.log(transactionhash);
        await transactionhash.wait()
        alert(`success${transactionhash}`)
        

        
      } catch (error) {
        console.log(error);
      }
    }
  };

  const submithandler = (e: FormEvent) => {
    e.preventDefault();
    sendTransaction();
  };
  useEffect(() => {
    getchainId();
    getAddress();
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
              ClickMe
            </button>
            <button onClick={getAddress} className="bg-black p-4  rounded-lg text-white">getAddress</button>

            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};
export default Goeril;
