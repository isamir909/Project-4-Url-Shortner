const express=require('express');
const router=express.Router();











//......................invalid params....................................//
router.all('*',function (req,res){res.status(400).send({msg:"this page does not exist"})})

module.exports=router

