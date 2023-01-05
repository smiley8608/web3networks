
import mongoose from "mongoose";

const accountschema= new mongoose.Schema({
    from:{
        type:String,
        require:true
    },to:{
        type:String,
        require:true
    },amount:{
        type:String,
        require:true
    },hash:{
        type:String,
        require:true
    },network:{
        type:String,
        require:true
    },chainId:{
        type:Number,
        require:true
    }
},{timestamps:true})

const AccountModel=  mongoose.model('transaction',accountschema)

export default AccountModel