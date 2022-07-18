const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const { urlencoded } = require('body-parser');
const app=express();
const router=require("./route/route");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://samirlohiya909:Lohiya123@samirlohiya.nszppy8.mongodb.net/Project-4group04Database?retryWrites=true&w=majority",{
    useNewUrlParser:true
})
.then(()=>console.log("MongoDb is connected"))
.catch(err=>{
    console.log(err.message)
})

app.use("/",router);

app.listen(process.env.PORT||3000,function()
   { console.log("express app running on port " +(process.env.PORT||3000 ))});

