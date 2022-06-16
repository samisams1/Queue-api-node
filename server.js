const path =require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var SocketIO = require('./app/socket');
var SocketIOR = require('./app/socket/report');
var SocketIOAnAuthenticate = require('./app/socket/anAuthenticate');


const app = express();

var corsOptions = {
 // origin: "http://localhost:8081"
 origin: "*"
};
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

//var app = express();
app.use(express.json());
var http = require("http").createServer(app);
app.use(cors())
const socketioJwt   = require('socketio-jwt');

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));
console.log(__dirname);

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