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
const{Sequelize} = require

const db = require("../models");
const sequelize = db.sequelize;
const Ticket = db.ticket;
const Branch = db.branch;
const Service = db.service;



var dateFormat = require('dateformat');
var today=dateFormat(new Date(), "yyyy-mm-dd");
const SocketIOTicket = io => {
    const jwt = require('jsonwebtoken');
    io.on('connection', socket => {

  //get
  socket.on("get_ticket", function (data) {
    // save message in database
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

    });
    // end
    // start
    socket.on("is_Ticket_Available", function (id) {
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' AND createdBy = '"+id+"' ", function (error, rows) {
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

      });

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
    //start
    socket.on("customer_befor_you", function (id) {
      console.log(id);
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled'  AND createdBy < '"+id+"' ", function (error, rows) {
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

    });
    //end

    });
}
module.exports = SocketIOTicket
