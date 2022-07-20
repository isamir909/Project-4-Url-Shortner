const urlModel=require('../model/urlModel')
 const {GET_ASYNC,SET_ASYNC}=require('../route/caching')
const shortId=require('shortid')
const validUrl = require('valid-url');

const createShortUrl=async function(req,res){

    try {
        const data=req.body
        const {longUrl}=data

        if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"object can not be empty,enter valid data"})
        if((typeof longUrl) != "string")return res.status(400).send({status:false,msg:"url must be string"})
    
        if(!data.longUrl.trim())return res.status(400).send({status:false,msg:"longUrl is required and can not be empty"})
       
        if(!validUrl.isUri(data.longUrl.trim()))return res.status(400).send({status:false,msg:"enter valid Url"})
 
        const findUrl=await urlModel.findOne({longUrl:longUrl}).select({urlCode:1,shortUrl:1,longUrl:1,_id:0})
        if(findUrl)return res.status(200).send({status:true,msg:"shortened url successfully",data:findUrl})
         
        const urlCode=shortId.generate()
        data['urlCode']=urlCode

        const shortUrl ="http://localhost:3000/"+urlCode
        data["shortUrl"]=shortUrl

       const createData=await urlModel.create(data)
       let shortenedUrl ={longUrl:createData.longUrl,shortUrl:createData.shortUrl,urlCode:createData.urlCode}
       
        return res.status(201).send({status:true,msg:"shortened url successfully",data:shortenedUrl})

    } catch (error) {
        return res.status(500).send({msg:error.msg})
    }
};
 
 
const getUrl = async function (req , res) {
    try { 
        let urlCode = req.params.urlCode.trim();
        
        //if(!shortId.isValid(urlCode))return res.status(400).send({status:false, message: "invalid short url, provide correct url"})
       
        let cachedUrlCode = await GET_ASYNC(`${urlCode}`)
           
        if(cachedUrlCode) {
            cachedUrlCode = JSON.parse(cachedUrlCode);
            return res.status(302).redirect(cachedUrlCode.longUrl)
        } else{
            let findUrl = await urlModel.findOne({urlCode:urlCode})
           if(!findUrl){return res.status(404).send({status:false, message: "No Url found"})}
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(findUrl))
            return res.status(302).redirect({ data: findUrl.longUrl });
        } 
    } catch (error) {
        return res.status(500).send({msg:error.msg})
        
    }};

module.exports={createShortUrl,getUrl}
