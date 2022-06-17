const path =require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var SocketIO = require('./app/socket');
var SocketIOR = require('./app/socket/report');
var SocketIOAnAuthenticate = require('./app/socket/anAuthenticate');
var jwt = require('jsonwebtoken');


const app = express();

var corsOptions = {
 // origin: "http://localhost:8081"
 origin: "*"
};
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

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

//app.use(cors());
app.use(function (request, result, next) {
  result.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/', (req, res) => {
  res.send('Wellcome to Our System')
})


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
require('./app/routes/ticket.route')(app);
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