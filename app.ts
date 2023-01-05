import bodyParser from 'body-parser'
import express  from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './router/router'
const app=express()

app.use(cors({
    origin:'http://localhost:3000',
    methods:['POST','GET','DELETE','UPDATE'],
    credentials:true,

}))

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/',router)

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/account',(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('Database connected successfully');
       app.listen(3002,()=>{
        console.log('Server conneted to the dataBase at Port :3002')
       }) 
    }

})