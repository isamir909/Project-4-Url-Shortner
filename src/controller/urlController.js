const urlModel=require('../model/urlModel')
const {GET_ASYNC,SET_ASYNC}=require('../route/caching')
const shortId=require('shortid')


const createShortUrl=async function(req,res){

    try {
        let data=req.body
        let reqLongUrl=data.longUrl
        
        if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"object can not be empty,enter valid data"})
        if((typeof reqLongUrl) != "string")return res.status(400).send({status:false,msg:"url must be string"})
    
        if(!reqLongUrl.trim())return res.status(400).send({status:false,msg:"longUrl is required and can not be empty"})
        const regex = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)

        if(!regex.test(reqLongUrl)) return  res.status(400).send({status:false,msg:"enter valid Url"})
 
        const findUrl=await urlModel.findOne({longUrl:reqLongUrl}).select({urlCode:1,shortUrl:1,longUrl:1,_id:0})
        if(findUrl)return res.status(200).send({status:true,data:findUrl})

        let UniqueUrlCode=shortId.generate() 
        data['urlCode']=UniqueUrlCode

        let findUrlCode=await urlModel.findOne({urlCode:UniqueUrlCode})
        if(findUrlCode){
            UniqueUrlCode=UniqueUrlCode + shortId.generate() 
             data['urlCode']=UniqueUrlCode
        }
        let shortUrl ="http://localhost:3000/"+UniqueUrlCode
        data["shortUrl"]=shortUrl

       const createData=await urlModel.create(data)
     
       let shortenedUrl ={longUrl:createData.longUrl,shortUrl:createData.shortUrl,urlCode:createData.urlCode}
       
        return res.status(201).send({status:true,data:shortenedUrl})

    } catch (error) {
        return res.status(500).send({msg:error.msg})
    }
};
 
 
const getUrl = async function (req , res) {
    try { 
        let urlCodeRequest = req.params.urlCode.trim();
        let cachedUrlCode = await GET_ASYNC(`${urlCodeRequest}`)
                 
        if(cachedUrlCode) {
            cachedUrlCode = JSON.parse(cachedUrlCode);
             res.status(302).redirect(cachedUrlCode.longUrl)
        } else{
            let findUrl = await urlModel.findOne({urlCode:urlCodeRequest})
         if(!findUrl){return res.status(404).send({status:false, message: "No Url found"})}
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(findUrl))
             res.status(302).redirect(findUrl.longUrl );
        }   
    } catch (error) {
        return res.status(500).send({msg:error.msg})
        
    }}; 

module.exports={createShortUrl,getUrl}

