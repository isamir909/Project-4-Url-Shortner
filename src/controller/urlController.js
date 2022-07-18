const urlModel=require('../model/urlModel')
const shortId=require('short-unique-id')
const validUrl = require('valid-url');




const createShortUrl=async function(req,res){

    try {
        const data=req.body
        const {longUrl}=data

        if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"object can not be empty,enter valid data"})
        if((typeof longUrl) != "string")return res.status(400).send({status:false,msg:"url must be string"})
    
        if(!data.longUrl.trim())return res.status(400).send({status:false,msg:"longUrl is required and can not be empty"})
       
        if(!validUrl.isWebUri(data.longUrl.trim()))return res.status(400).send({status:false,msg:"enter valid Url"})
 
        const findUrl=await urlModel.findOne({longUrl:longUrl})
        if(findUrl)return res.status(201).send({status:true,msg:"data created sucessfully",data:findUrl})
        
        const uid=new shortId({length: 7})
        const urlCode=uid();
        data['urlCode']=urlCode

        const shortUrl ="http://localhost:3000/"+urlCode
        data["shortUrl"]=shortUrl

       const createData=await urlModel.create(data)
        return res.status(201).send({status:true,msg:"shortened url successfully",data:createData})

    } catch (error) {
        return res.status(500).send({msg:error.msg})
    }
}








module.exports={createShortUrl}