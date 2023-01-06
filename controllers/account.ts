
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

export const GetHistory=async(req:express.Request,res:express.Response)=>{
    console.log(req.query);
    
    const {chain,page,perpage}:any=req.query
    console.log(chain);
    console.log(page);
    console.log(perpage);
    const count=await AccountModel.find({chainId:chain}).countDocuments()
    console.log(count);
    
     AccountModel.find({chainId:chain}).skip((page)*perpage).limit(perpage)
     .then((result)=>{
        if(result.length<1){
            return res.json({message:'These network does not contains any transaction history'})
        }else{
            console.log(result.length);
            // console.log(result);
            
            
            return res.json({Transaction:result,count:count})
        }
     })
     .catch(err=>{
        console.log(err);
        
     })   


}