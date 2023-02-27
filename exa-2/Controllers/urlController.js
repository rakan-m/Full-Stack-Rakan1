const URL = require("../Schema/urlSchema");
const validator = require("validator");
const { url } = require("inspector");

exports.URL = async(req,res) => {
    try{
      //1.check if the long url is valid       
      let chckURL = await URL.findOne({longURL:req.body.longURL});

        if(!chckURL){
            return res.status(409).json({message: "Invalid URL."});
        }
       //2. if exist then create a shortened url
       
        //shortUrl = //... ma 3rft kammel
        //urlCode = //...

      //everthing's okay
      url = new URL({
        chckURL,
        urlCode,
        shortUrl
      });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Error!!' });
    }
};