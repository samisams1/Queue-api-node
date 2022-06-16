const path =require('path');
//var cors = require('cors');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//var atob = require('atob');
//var Cryptr = require('cryptr'),
//cryptr = new Cryptr('myTotalySecretKey');
//var express = require("express");

var jwt = require('jsonwebtoken');


const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));

//var printer = require("thermal-printer");
//var printer = require("./node-thermal-printer");
//var printer = require("node-thermal-printer").printer;
//var printer = require("./node-thermal-printer");
///////////////
///////////////////
var dateFormat = require('dateformat');

//var app = express();
app.use(express.json());
var http = require("http").createServer(app);
//app.use express(cors());

//var express = require('express')
//var cors = require('cors')
//var app = express()

app.use(cors())
//create socket instance with http
var io = require("socket.io")(http);
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
// use mysql
var mysql = require("mysql");
const { request } = require('http');
//const path = require("path");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  //  database: process.env.DATABASE
  database: "quenode"
});
 
connection.connect(function (error) {
    // show error, if any
})