const { Sequelize } = require("../models");
const db = require("../models");
const sequelize = db.sequelize;
const Ticket = db.ticket;
const Branch = db.branch;

exports.branchQueue = (req, res) => {
  Branch.findAll({
    attributes: [
      'value'
    ]
  /*  include: [{
      model: Ticket,
     // where: ["year_birth = post_year"]
     }],
    attributes: [
      'value',
      [Sequelize.literal('COUNT(value)'), 'count_queue']
    ],
   group: 'branchId'
*/

}).then(function(ticket){

  
  console.log("result");
  res=  res.send(JSON.stringify(ticket));

  var sams = JSON.stringify(ticket);

  var objectValue = JSON.parse(sams);
console.log(objectValue[0].id);


}).catch(function(err){
  console.log('Oops! something went wrong, : ', err);
});
}


exports.serviceQueue = (req, res) => {
  Ticket.findAll({
}).then(function(ticket){
 console.log("result");
  res.send(JSON.stringify(ticket));
}).catch(function(err){
 console.log('Oops! something went wrong, : ', err);
});
}



