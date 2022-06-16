console.log("Server JS")
const path =require('path');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var SocketIO = require('./app/socket');
var SocketIOR = require('./app/socket/report');
var SocketIOAnAuthenticate = require('./app/socket/anAuthenticate');
var dateFormat = require('dateformat');
var jwt = require('jsonwebtoken');


const app = express();

var corsOptions = {
 // origin: "http://localhost:8081"
 origin: "*"
};
var date=dateFormat(new Date(), "yyyy-mm-dd");
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
app.use(cors(corsOptions));
var dateFormat = require('dateformat');

//var app = express();
app.use(express.json());
var http = require("http").createServer(app);
app.use(cors())
const socketioJwt   = require('socketio-jwt');
//dotenv.config({path:'./env'})
// add headers
const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));
console.log(__dirname);
app.set('view engine','hbs');
app.use(function (request, result, next) {
    result.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

//app.use(cors());
app.use(function (request, result, next) {
  result.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

//
var io = require('socket.io')(http);

SocketIO(io)
SocketIOR(io)
SocketIOAnAuthenticate(io)
// use mysql
var mysql = require("mysql");
const { request } = require('http');
const { verifyToken } = require('./app/middleware/authJwt');
//const path = require("path");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  //  database: process.env.DATABASE
  database: "queedb"
});

app.get("/",function(request,result){
   result.render("index");
});

// create API for get_message
app.get("/get_messages", function (request, result) {
    connection.query("SELECT * FROM tickets WHERE status='unCalled' ORDER BY id DESC ", function (error, messages) {
        // return data will be in JSON format
        result.end(JSON.stringify(messages));
    });
      //total current
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });
    
});
// create API for get_message
app.get("/get_messages1", function (request, result) {
    connection.query("SELECT  ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        result.end(JSON.stringify(rows));
    });
      //total current
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });
});
//total api
app.get("/total_api", function (request, result) {
 
    //total current
    connection.query("SELECT  ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
      // return data will be in JSON format
      total_ticket = rows.length;
      io.emit("total_Number_of_ticket", total_ticket);
  });
});
// all users
/*app.get("/all",(request,res)=>{
 //connection.query("SELECT COUNT(A.status)  AS total,updatedBy,username,firstName,lastName,windowNumber FROM ticket AS  A  INNER JOIN users B ON A.updatedBy = B.id WHERE A.updatedDate ='"+date+"' GROUP BY A.updatedBy   ", function (error, rows) 
  connection.query("SELECT  * FROM users  AS A INNER JOIN user_roles B ON A.id = B.userId",
  (err,result)=> {
      if(err){
          res.send({err:err});

      }
      if(result.length > 0){
        //res.send({result});
      res.send(JSON.stringify(result));
      }
      else{
          
        res.send({message:"wrong username/password Combinations"});
          
      }
    
});

});
*/
//update user status
app.put("/update_user_status",function(request,result){
  var status = request.body.status
  var id = request.body.id
  connection.query("UPDATE users SET status='"+status+"' WHERE id = '"+id+"' ",function(error,rows){
    result.end(JSON.stringify(rows));
     // console.log("abiy abebe" + winNum)
  });

});
//get System Name
app.get("/systemName", function (request, result) {
  connection.query("SELECT  systemName FROM settings  ", function (error, rows) {
    result.end(JSON.stringify(rows));
});

});
var port = 8080;
http.listen(port,function(){
    console.log("Listening to port " + port);
});
// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/report.routes')(app);
require('./app/routes/window.routes')(app);
require('./app/routes/service.route')(app);
require('./app/routes/branch.route')(app);
require('./app/routes/notificaton.route')(app);
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}