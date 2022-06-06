const jwt = require("jsonwebtoken");
require('dotenv').config()
jwtSecret=process.env.JWT_SECRET;
module.exports.requestcheck = async function(req, res, next)   {
    try {
        const jwtToken =(req.headers['token']).slice(1,-1);
        // console.log("token from auth.js"+jwtToken);

        if(!jwtToken){
            return res.status(403).end({ msg: "authorization denied" });
        }else{
            const verify = jwt.verify(jwtToken,jwtSecret,function(err, decoded) {
                if(err){
                    console.error(err)
                    return res.status(403).end(JSON.stringify({ msg: "Invalid Token" }));
                }else{
                    // console.log(decoded)
                    if(req.params.id){
                        if(decoded.user.id==req.params.id){
                            // console.log(decoded.user.id)
                            // console.log(req.params.id)
                            next();
                        }else{
                            return res.status(403).end(JSON.stringify({ msg: "Invalid Token" }));
                        }
                    }
                    if(req.body.uid) {
                        if(decoded.user.id==req.body.uid){
                            // console.log(decoded.user.id)
                            // console.log(req.body.uid)
                            next();
                        }else{
                            return res.status(403).end(JSON.stringify({ msg: "Invalid Token" }));
                        }
                    }
                }
               });
        }
        // next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).end("Token is not Provided");
    }
}


module.exports.verifytoken = async function(req, res, next)   {
    try {
        const jwtToken =(req.headers['token']).slice(1,-1);
        // const jwtToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo0Mn0sImlhdCI6MTYxNTUyNDI5NSwiZXhwIjoxNjE1NTI3ODk1fQ.z66xSiJUgMzF6Gh_uKs4GHxW39xK_qd0JMDNd0ns8U8"
        // console.log("token from auth.js "+jwtToken);

        if(!jwtToken){
            // return res.status(403).end({ msg: "authorization denied" });
        }else{
            const verify = jwt.verify(jwtToken, jwtSecret,function(err, decoded) {
                if(err){
                    console.error(err)
                    return res.status(403).end(JSON.stringify({ msg: "Invalid Token" }));
                }else{
                    // console.log(decoded)
                    // return res.status(200).end(JSON.stringify({ msg: "valid Token" }));
                    return null
                }
               });
        }
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).end("TOKEN IS NOT PROVIDED");
    }
}