const db = require("../models");
const config = require("../config/auth.config");
const sequelize = db.sequelize;
const Service = db.service;

exports.allService = (req, res) => {
   Service.findAll({
}).then(function(users){
  console.log("result");
 // res.send({error:false,message:'users list',data:users});
   res.send(JSON.stringify(users));
}).catch(function(err){
  console.log('Oops! something went wrong, : ', err);
});
}
exports.saveService = (req, res) => {
  Service.create({
    value: req.body.value,
    status:"active"
  });
   
}


