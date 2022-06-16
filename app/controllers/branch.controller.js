const db = require("../models");
const config = require("../config/auth.config");
const sequelize = db.sequelize;
const Branch = db.branch;

exports.allBranch = (req, res) => {
    Branch.findAll({
}).then(function(branchs){
  console.log("result");
   res.send(JSON.stringify(branchs));
}).catch(function(err){
  console.log('Oops! something went wrong, : ', err);
});
}
exports.saveBranch = (req, res) => {
  Branch.create({
    value: req.body.value,
    status:"active"
  });
   
}


