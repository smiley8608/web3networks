
import  express  from "express";
import AccountModel from "../models/accountmodel";

export const AddAccount=  (req:express.Request,res:express.Response)=>{

    console.log(req.body);
    const {recipient,amount,currentAddress,transactionhash,network,chainId}=req.body
    // console.log(recipient,value,currentAddress,transactionhash);
    

       AccountModel.create({from:currentAddress,to:recipient,amount:amount,hash:transactionhash,network:network,chainId:chainId})
       .then(result=>{
        if(!result){
            return res.json({message:'Some thing wents wrong'})
        }else{
            return res.json({message:'Transaction histroy Updated !'})
        }
       })
       .catch()

}