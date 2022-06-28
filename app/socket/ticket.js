
const { verifyToken } = require('../authenticate')
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  //  database: process.env.DATABASE
  database: "queedb"
});
var Sequelize = require('sequelize');
const db = require("../models");
const sequelize = db.sequelize;
const Ticket = db.ticket;
const Branch = db.branch;
const Service = db.service;

var dateFormat = require('dateformat');
var today=dateFormat(new Date(), "yyyy-mm-dd");
const SocketIOTicket = io => {
    const jwt = require('jsonwebtoken');
    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
          jwt.verify(socket.handshake.query.token, 'login_details', function(err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
        //    console.log("samson mamushet"+socket.handshake.query.username)
            next();
          });
        }
        else {
          next(new Error('Authentication error'));
        }
      })
    io.on('connection', socket => {

  //get ticket
  socket.on("get_ticket", function (data) {
    serviceId = data.serviceId;
    branchId = data.branchId;
    id = data.id;
    connection.query("SELECT * FROM tickets WHERE id =( SELECT MAX(id)  FROM tickets limit 1) ", function (error, rows) {
if(rows.length >0){
  ticketNumber = rows[0].ticketNumber;
  newTicketNumber = ticketNumber + 1;
  //get before
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled'    ", function (error, rows) {
      // return data will be in JSON format
       total_ticket = rows.length;
        socket.emit("total_Number_of_ticket", total_ticket);
        console.log(total_ticket);
          console.log("baleder");
      if( rows.length > 0){
        total_ticket = rows.length;
        console.log(total_ticket);
connection.query("INSERT INTO tickets (ticketNumber,status,updatedBy,dedcatedWindow,createdDate,cratedBy,windowNumber,branchId,serviceId,ticket_before) VALUES ('"+newTicketNumber+"','unCalled',0,0,'"+today+"','"+id+"','wait','"+branchId+"','"+serviceId+"','"+rows.length+"')", function (error, result) {
socket.emit("customer_befor_you", total_ticket);
 connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
  total_ticket = rows.length;
  console.log(total_ticket);
  io.emit("total_Number_of_ticket", total_ticket);
 });
});
}
});
}else{
  connection.query("INSERT INTO tickets (ticketNumber,status) VALUES ('0','Called')", function (error, rows) {
    console.log(rows.length);
   });
}
});

});

//start get ticket listen
socket.on('my_ticket',(id)=>{
  console.log(id);
  connection.query("SELECT  * FROM tickets where status='unCalled'  ", function (error, rows) {
      data = rows;
      socket.emit("my_ticket", data);
    //  console.log(data);
  });
});
//end get ticket
//start get Service by branchId
socket.on('service_by_branch_id',(branchId)=>{
    Service.findAll({
      attributes: [
         'id','value',
         [Sequelize.literal(`(
                 SELECT COUNT(*)
                 FROM tickets
                 WHERE
                     tickets.serviceId = services.id AND  tickets.status = 'unCalled'
             )`),
           'count']
         ],
       where:{
            branchId:branchId
         }
  }).then(function(ticket){
  var data = ticket;
  socket.emit("service_by_branch_id", data);
    var data = JSON.stringify(ticket);
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
    total_ticket = rows.length;
    io.emit("total_Number_of_ticket", total_ticket);
});

  }).catch(function(err){
    console.log('Oops! something went wrong, : ', err);
  });

});
    // start
    socket.on("is_Ticket_Available", function (id) {
    /*  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' AND createdBy = '"+id+"' ", function (error, rows) {
          // return data will be in JSON format
          if(rows.length > 0){
            total_ticket = rows.length;
            socket.emit("is_Ticket_Available", total_ticket);
            console.log("total_ticket");
            console.log(total_ticket);
          }else{
            total_ticket = 0;
            socket.emit("is_Ticket_Available", total_ticket);
          }

      });*/

    });
    //end
    //start
    socket.on("getService", function (serviceId) {
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled'  AND serviceId = '"+serviceId+"' ", function (error, rows) {
          service_queue = rows.length;
          socket.emit("getService", getService);
      });

    });
    //end

    //start get specific tickets
    socket.on("specific_my_ticket", function (data) {
      console.log(data.id);
      connection.query("SELECT  * FROM tickets WHERE id= '"+data.id+"'  ", function (error, rows) {
          data = rows;
          socket.emit("specific_my_ticket", data);
      });

    });
    //end ticket
    //customerbefor you
    socket.on("customer_befor_you", function (id) {
      console.log(id);
      connection.query("SELECT branchId,serviceId FROM tickets WHERE id = '"+id+"'    ", function (error, rows) {
           if( rows.length > 0){
             total_ticket = rows.length;
              var  branchId= rows[0].branchId;
              var  serviceId=     rows[0].serviceId;

              connection.query("SELECT  id,ticketNumber FROM tickets WHERE   serviceId = '"+serviceId+"' AND branchId = '"+branchId+"' AND status='unCalled' AND   id < '"+id+"'    ", function (error, rows) {
                    // return data will be in JSON format
                    if( rows.length > 0){
                      total_ticket = rows.length;
                      socket.emit("customer_befor_you", total_ticket);
                     // io.emit("Number_of_customer_before", total_ticket);
                   }else{
                     total_ticket = 0;
                     socket.emit("customer_befor_you", total_ticket);
                   }

                });

          }else{
            total_ticket = 0;
            socket.emit("customer_befor_you", total_ticket);
          }

       });
    });
    //end

    });
}
module.exports = SocketIOTicket;

  //  res=  res.send(JSON.stringify(ticket));
