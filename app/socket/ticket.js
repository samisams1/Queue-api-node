const { verifyToken } = require('../authenticate')
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  //  database: process.env.DATABASE
  database: "queedb"
});


//const { Sequelize, service } = require("../models");
// const {Sequelize,service} = require
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

    Ticket.findAndCountAll()
.then(result => {
    console.log(result.count);
  //  console.log(result.rows);
  if(result.count >0){
    connection.query("SELECT * FROM tickets WHERE id =( SELECT MAX(id)  FROM tickets limit 1) ", function (error, rows) {
      ticketNumber = rows[0].ticketNumber;
      newTicketNumber = ticketNumber + 1;
  //    console.log(rows[0].id);
    //  console.log(rows[0].ticketNumber);

      //get before

      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled'    ", function (error, rows) {
          // return data will be in JSON format
          if( rows.length > 0){
            total_ticket = rows.length;
            console.log(total_ticket);
            console.log("welega");

            const tickt =  Ticket.create({
              ticketNumber:newTicketNumber,
              status:"unCalled",
              updatedBy:0,
              dedcatedWindow:0,
              createdDate:today,
              cratedBy:id,
              windowNumber:'wait',
              branchId:branchId,
              serviceId:serviceId,
              ticket_before:rows.length,
        });

   socket.emit("customer_befor_you", total_ticket);
          //  socket.emit("customer_befor_you", total_ticket);
           // io.emit("Number_of_customer_before", total_ticket);
         }else{
           total_ticket = 0;
           socket.emit("customer_befor_you", total_ticket);
         }

      });



  Ticket.findAndCountAll()
.then(result => {
  console.log(result.count);
//  console.log(result.rows);
if(result.count >0){
  total_ticket = result.count;
  io.emit("total_Number_of_ticket", total_ticket);
}
});
});
  }
    else{
  const newTicketNumber = 1;
          const tickt =  Ticket.create({
            ticketNumber:newTicketNumber,
            status:"unCalled",
            updatedBy:0,
            dedcatedWindow:0,
            createdDate:today,
            cratedBy:id,
            windowNumber:'wait',
            branchId:branchId,
            serviceId:serviceId,
            ticket_before:1,
      });
    }
})
.catch(err => {
    throw err;
});
});

//start get ticket listen
socket.on('my_ticket',(id)=>{
  console.log(id);
  console.log("lalalalal");
  console.log("hanitshisami");
  connection.query("SELECT  * FROM tickets WHERE cratedBy='"+id+"'   ORDER BY ticket_before ASC ", function (error, rows) {
      data = rows;
      socket.emit("my_ticket", data);
      console.log(data);
  });
});
//end get ticket
//start get Service by branchId
socket.on('service_by_branch_id',(branchId)=>{
/*  console.log(branchId);
  console.log("lalalalal");
  console.log("hanitshisami");
  connection.query("SELECT  * FROM tickets WHERE branchId='"+branchId+"' ", function (error, rows) {
      data = rows;
      socket.emit("service_by_branch_id", data);
  });

  */
  //  const branchId = req.params.branchId;
  //const  branchId=  req.params.branchId;
  //const  branchId = req.params.branchId;

  //var branchId = JSON.parse(req.params.branchId);
  //  console.log("branchId");
//  console.log(branchId);
//  console.log("shimelis");
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
            branchId:branchId
         }
  }).then(function(ticket){
    //  console.log("branchId");
  //  console.log(branchId);
  //  console.log("shimelis");
  //  res=  res.send(JSON.stringify(ticket));
  var data = ticket;
  socket.emit("service_by_branch_id", data);
    var data = JSON.stringify(ticket);
//console.log(data);
  //  var objectValue = JSON.parse(data);
//  console.log(objectValue[0].id);
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
    // return data will be in JSON format
    total_ticket = rows.length;
    io.emit("total_Number_of_ticket", total_ticket);
});

  }).catch(function(err){
    console.log('Oops! something went wrong, : ', err);
  });

});
//end get ticket
/*  socket.on("get_ticket", function (data) {
    serviceId = data.serviceId;
    id= data.id;
    connection.query("SELECT * FROM tickets WHERE id =( SELECT MAX(id)  FROM tickets limit 1) ", function (error, rows) {

      if(rows.length>0){
      // return data will be in JSON format
      ticketNumber = rows[0].ticketNumber;
      newTicketNumber = ticketNumber + 1;
      console.log(rows[0].id);
      console.log(rows[0].ticketNumber);
      connection.query("INSERT INTO tickets (ticketNumber,status,updatedBy,dedcatedWindow,createdDate,createdBy,windowNumber,serviceId) VALUES ('" +newTicketNumber+ "','unCalled','5','"+28+"','"+today+"','"+data+"','wait','"+serviceId+"')", function (error, result) {
        // server will send message to all connected clients
       id =  result.insertId;
        io.emit("get_ticket",  id,data);

        connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
          // return data will be in JSON format
          total_ticket = rows.length;
          io.emit("total_Number_of_ticket", total_ticket);
      });

    });
  }
  });
    connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        if(rows.length > 0){
          total_ticket = rows.length;
          io.emit("total_Number_of_ticket", total_ticket);
        }else {
          total_ticket = 0;
          io.emit("total_Number_of_ticket", total_ticket);

        }

    });

  });*/
    // end
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
    //startFre


    socket.on("customer_befor_you", function (id) {
      console.log(id);
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' AND   id < '"+id+"'    ", function (error, rows) {
          // return data will be in JSON format
          if( rows.lenFgth > 0){
            total_ticket = rows.length;
            socket.emit("customer_befor_you", total_ticket);
           // io.emit("Number_of_customer_before", total_ticket);
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
