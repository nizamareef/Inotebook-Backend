const dotenv=require('dotenv')
var jwt = require('jsonwebtoken');

const jwt_secret = process.env.JWTSECRET;

const fetchdata = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send("Access Denied")
    }
    const data = jwt.verify(token, jwt_secret)
    console.log(data)
    req.userid = data.userId
    next()
}

module.exports = fetchdata