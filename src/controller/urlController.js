const urlModel=require('../model/urlModel')
const shortId=require('short-unique-id')
const validUrl = require('valid-url');
const validator=require('../middleware/validation')



// <!-- input ww.bnxdbn.com
// uniqueid
// http://localhost:3000/+uniqueid
// res:http://localhost:3000/+uniqueid -->

// - Create a short URL for an original url recieved in the request body.
// - The baseUrl must be the application's baseUrl. Example if the originalUrl is http://abc.com/user/images/name/2 then the shortened url should be http://localhost:3000/xyz
const createShortUrl=async function(req,res){

    try {
        const data=req.body

        
        // //validation for body
        // if (validator.isBodyExist(data)) {
        //     return res.status(400).send({ status: false, message: "Data is required, Please provide Url details." })
        // }

        // //validation for Longurl
        // if (!Object.keys(data).includes("longUrl"))
        //     return res.status(400).send({ status: false, message: "longUrl is required." });
        // if (typeof (data.longUrl) != "string") {
        //     return res.status(400).send({ status: false, message: "Url must be a string." });
        // }
        // if (data.longUrl.trim() == '') {
        //     return res.status(400).send({ status: false, message: "url input can't be empty." });
        // }
        // if(!validUrl.isWebUri(data.longUrl.trim())){
        //     return res.status(400).send({status:false,msg:"enter valid Url"})
        // }
        // if (await urlModel.findOne({ longUrl: data.longUrl })) {
        //     return res.status(400).send({ status: false, message: "Url already present." });

        // }


    //     if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"object can not be empty,enter valid data"})

    //     if(!data.longUrl.trim())return res.status(400).send({status:false,msg:"longUrl is required and can not be empty"})
        
    //  //   if(!isValid(data.longUrl))return res.status(400).send({status:false,msg:"input must be type string"})

    //     if(!validUrl.isWebUri(data.longUrl.trim()))return res.status(400).send({status:false,msg:"enter valid Url"})
 

       
        //validation for null undefined
       
        //string validation
        //Db call to check uniqueness of long url
        
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