const { Sequelize, service } = require("../models");
const db = require("../models");
const sequelize = db.sequelize;
const Ticket = db.ticket;
const Branch = db.branch;
const Service = db.service;

exports.branchQueue = (req, res) => {
  Branch.findAll({
    attributes: [
       'id','value',
       [Sequelize.literal(`(
               SELECT COUNT(*)
               FROM tickets
               WHERE
                   tickets.branchId = branchs.id
           )`),
         'count']
       ],
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
//  const branchId = req.params.branchId;
//const  branchId=  req.params.branchId;
const  branchId = req.params.branchId;

//var branchId = JSON.parse(req.params.branchId);
  console.log("branchId");
console.log(branchId);
console.log("shimelis");
  Service.findAll({

    attributes: [
       'id','value',
       [Sequelize.literal(`(
               SELECT COUNT(*)
               FROM tickets
               WHERE
                   tickets.serviceId = services.id
           )`),
         'count']
       ],
     where:{
          branchId:2
       }
}).then(function(ticket){
    console.log("branchId");
  console.log(branchId);
  console.log("shimelis");
  res=  res.send(JSON.stringify(ticket));

  var sams = JSON.stringify(ticket);

  var objectValue = JSON.parse(sams);
console.log(objectValue[0].id);


}).catch(function(err){
  console.log('Oops! something went wrong, : ', err);
});
}

exports.myTicket = (req,res) =>{
  const bId = req.body.branchId;
  console.log("ras");
  console.log(bId);
  Ticket.findAll({
    where: {
      createdBy: bId,
      status:"unCalled"
    }
}).then(function(service){
 console.log("result");
  console.log("mihiret");
    console.log(bId);
  res.send(JSON.stringify(service));
  co
}).catch(function(err){
 console.log('Oops! something went wrong, : ', err);
});
}
