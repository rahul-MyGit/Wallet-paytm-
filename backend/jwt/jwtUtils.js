const jwt=require('jsonwebtoken');
const JWT_SECRET = require('../config')

function verifyJwt(token){
    return jwt.verify(token,JWT_SECRET,(err,decoded)=>{
        if(err) return false;
        else return true;
    })
}

module.exports={
    verifyJwt
}