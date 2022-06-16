const jwt = require('jsonwebtoken')
var users = require('./shared/users')
const secretKey = 'bezkoder-secret-key'

exports.signToken = creds => jwt.sign(creds, secretKey)
exports.verifyToken = (token1, callback) => jwt.verify(token1, secretKey, (err, jwt_payload) => {
    if (err) callback(true, null)
    else if(users.checkUser(jwt_payload.username)){  callback(false, users.checkUser(jwt_payload.username))
    console.log("kebede"); }
    else callback(true, null)
})