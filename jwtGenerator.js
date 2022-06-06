const jwt = require("jsonwebtoken");
require('dotenv').config()
const secret = process.env.JWT_SECRET
function jwtGenerator(id){
    const payload = {
        user:{
            id:id
        }
    }
    return jwt.sign(payload,secret);
}

module.exports = jwtGenerator;