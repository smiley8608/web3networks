import { FormEvent, useEffect, useState } from "react"
import Web3 from "web3"
import config from "../config"

const Goeril=()=>{

    const {ethereum}:any=window
    const web3=new Web3(ethereum)
    
    const [data,setData]=useState<any>({recipient:'',amount:''})
    const [currentAccount,setCurrentAccount]=useState('')
    const [chainId,setchainId]=useState<number>()

    const createContract=()=>{
        web3.setProvider('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161')

        const contract=new web3.eth.Contract(config.goerli.contractABI,config.goerli.contractaddress)
        console.log(contract);
        

        return contract

    }

   const getchainId=async()=>{
      const currentchainid= await web3.eth.getChainId()
      console.log(currentchainid)
      setchainId(currentchainid)
   }


   const getAddress=async()=>{

   const accounts= await ethereum.request({
        method:'eth_requestAccounts'
    })
    console.log(accounts);
    setCurrentAccount(accounts)
    
   }
   const sendTransaction=async(data:any)=>{
    try {
        console.log(data)
               
        const Contract=createContract()
        console.log(Contract);

       const contractdata= await Contract.methods.transfer(data.recipient,data.amount).call((err:any,txhash:any)=>{
                if(err){
                    console.log(err);
                    
                }else{
                    console.log(txhash);
                    return txhash
                }
                
       })
        console.log(contractdata);
        // await web3.givenProvider.request({
        //     method:'eth_sendTransaction',
        //     params:[{
        //         from:currentAccount,
        //         to:config.goerli.contractaddress,
        //         gas:'0x5208',
        //         data:contractdata
        //     }]
        // })
        
    //    const transactionhash= await transaction.wait()
    //    alert(`success : ${transaction.hash}`)
        
    } catch (error) {
        console.log(error)
    }
   }
   const submithandler=(e:FormEvent)=>{

    e.preventDefault()
    sendTransaction(data)
    console.log(data)
   }
   useEffect(()=>{
    getchainId()
    getAddress()
   },[])
    return(
        <div>
            <div className="w-full text-center mt-3">
        <h1 className="font-bold text-xl">Transaction </h1>
      </div>
      <div className="w-full flex justify-center mt-8">
       
            <div>
              <form >
                <div>
                  <label className="font-bold text-xl">
                    Receptent ADDress :
                  </label>

                  <input
                    type={"text"}
                    name={"recipient"}
                    onChange={(e)=>{setData({...data,recipient:e.target.value})}}
                    className="border p-3 rounded-lg"
                  />
                </div>
                <div className="mt-3">
                  <label className="font-bold text-xl">Amount :</label>
                  <input
                    type={"number"}
                    step="0.0001"
                    name={"amount"}
                    onChange={(e)=>{setData({...data,amount:e.target.value})}}
                    className="border p-3 rounded-lg ml-20"
                  />
                </div>
                <button
                  onClick={submithandler}
                  className="bg-black p-4 h-5 mt-14 ml-7"
                >
                  ClickMe
                </button>
                
              </form>
            </div>
       
       
         
        
      </div>

        </div>
    )
}
export default Goeril