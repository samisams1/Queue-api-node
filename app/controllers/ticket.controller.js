console.log("Server JS")
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

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });
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


// add listener for new connection
io.on("connection", function (socket) {
    // this is socket for each user
    let today = new Date().toISOString();

   // var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var time=dateFormat(new Date(), "yyyy-mm-dd");
    console.log(time + "User connected", socket.id);

   
    socket.on("insertNew",function(data){
      connection.query("INSERT INTO ticket (ticketNumber,status) VALUES ('44','unCalled')", function (error, result) {
    // server will send message to all connected clients
   id =  result.insertId;
    io.emit("new_message",  id,data);
});




})
socket.on("new_message", function (data) {
console.log("Client says", data);

// save message in database
connection.query("INSERT INTO ticket (ticketNumber,status,audioNumber,updatedBy) VALUES ('" + data + "','unCalled','../../src/files/d2.m4a','5')", function (error, result) {
    // server will send message to all connected clients
   id =  result.insertId;
    io.emit("new_message",  id,data);
});
// first ten
connection.query("SELECT  ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
    // return data will be in JSON format
    c1 = rows.length;
    first_ten_ticket=rows;
    io.emit("first_ten_ticket", first_ten_ticket,c1);
});
//current ticket
connection.query("SELECT MAX(id) id,ticketNumber FROM ticket  WHERE status='called'", function (error, rows) {
    // return data will be in JSON format
    current_ticket = rows[0].ticketNumber;
    io.emit("current_ticket", current_ticket);
});
//total number of ticket
connection.query("SELECT  id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
    // return data will be in JSON format
    total_ticket = rows.length;
    io.emit("total_Number_of_ticket", total_ticket);
});

});
//
socket.on("play", function(playMsg) {
// delete from database
// connection.query("SELECT  id FROM ticket WHERE status='unCalled' WHERE id > '"+465+"''ORDER BY id ASC LIMIT 1", function (error, rows) {
connection.query("SELECT  id,ticketNumber,audioNumber,updatedBy FROM ticket WHERE status='unCalled' LIMIT 1 ", function (error, rows) {
    // return data will be in JSON format
var  id = rows[0].id;
var data = rows[0].ticketNumber;
var updatedBy = rows[0].updatedBy;
var userId=  playMsg.userId

console.log("samsi" + playMsg.userId)
var timestamp = new Date().getTime();
// var audio = rows[0].audioNumber;
// io.emit("deleteTicket",id,data,audio);
    connection.query("UPDATE  ticket SET  status ='called',updatedBy= '"+userId+"',updatedDate ='"+time+"'  WHERE id = '" +id+ "'", function (error, result) {
        // send event to all users
       
   //     io.emit("deleteTicket",id,data,audio);
    });
    //ticteNumber Audio
    connection.query("SELECT value,audioAdress FROM audioequivalent WHERE value='"+data+"' ORDER BY id DESC LIMIT 1", function (error, aodioRows) {
        // return data will be in JSON format
        var audio = aodioRows[0].audioAdress;
       // io.emit("deleteTicket",id,data,audio);
        connection.query("SELECT value,audioAdress FROM audioequivalent WHERE value='"+updatedBy+"' ORDER BY id DESC LIMIT 1", function (error, windowRows) {
            // return data will be in JSON format
            var windoNumber = windowRows[0].audioAdress;
            io.emit("deleteTicket",id,data,audio,windoNumber);
           // io.emit("play",playMsg,audio,windoNumber);
            io.emit("play",playMsg);
            io.emit("getAudio",windoNumber);
        });
    });
    //current
    connection.query("SELECT id,ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 1", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        io.emit("current_ticket", current_ticket);
    });
    //total
    connection.query("SELECT  id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });
    connection.query("SELECT  ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.ticketNumber;
        io.emit("deleteTicket", id);
    });
       // first ten
connection.query("SELECT  ticketNumber,updatedBy FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
    // return data will be in JSON format
    c1 = rows.length;
    first_ten_ticket=rows;

   io.emit("first_ten_ticket", first_ten_ticket,c1);
});
});
//total
connection.query("SELECT  id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
    // return data will be in JSON format
    total_ticket = rows.length;
    io.emit("total_Number_of_ticket", total_ticket);
});
 //current 
 

}); 
socket.on("stop",msg=>io.emit("stop"))
//play sound
/*socket.on("play",playMsg=>{
io.emit("play",playMsg);
}); */
    
// attach listener to server
socket.on("delete_message", function (messageId) {
    // delete from database
    connection.query("UPDATE  ticket SET status ='called' WHERE id = '" + messageId + "'", function (error, result) {
        // send event to all users
        io.emit("delete_message", messageId);
    });
    //current 
    connection.query("SELECT MAX(id) id,ticketNumber FROM ticket WHERE status='called' ", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        io.emit("current_ticket", current_ticket);
    });
    
    // first ten
    connection.query("SELECT  ticketNumber,updetedBy FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        c1 = rows.length;
        first_ten_ticket=rows;
        io.emit("first_ten_ticket", first_ten_ticket,c1);
    });
    //total
    connection.query("SELECT  id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });
});

   // current ticket number
   socket.on("current_ticket", function (current_ticket,userId) {
    connection.query("SELECT id,ticketNumber FROM ticket WHERE status='called'  AND updatedBy = "+1+" ORDER BY id DESC LIMIT 1", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        //s1= rows[0].ticketNumber;
        io.emit("current_ticket", current_ticket);
    });
    
}); 
 // current ticket number
 socket.on("get_current_id", function (current_ticket) {
    connection.query("SELECT MIN(id) id,ticketNumber FROM ticket WHERE status='called' AND updatedBy = "+1+" ", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        io.emit("get_current_id", current_ticket);
    });
    
}); 


// total ticket number
socket.on("total_Number_of_ticket", function (total_ticket) {
    connection.query("SELECT  id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
        io.emit("Number_of_customer_before", total_ticket);
    });
    
});
//customer served
socket.on("customer_served", function (userId) {
  connection.query("SELECT  id,ticketNumber FROM ticket WHERE (updatedBy = '"+21+"' AND status='called' AND updatedDate='"+time+"' ) ", function (error, servedRows) {
      // return data will be in JSON format
      servedCustomer = servedRows.length;
      io.emit("customer_served", servedCustomer);
      console.log(userId)
  });
  
});
//select first ten ticket number
socket.on("first_ten_ticket", function (first_ten_ticket) {
    connection.query("SELECT updatedBy,ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        c1 = rows.length;
        first_ten_ticket=rows;
        io.emit("first_ten_ticket", first_ten_ticket,c1);
    });
    
})
 // current ticket number
 /*socket.on("current_ticket", function (current_ticket) {
    connection.query("SELECT MIN(id) id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        io.emit("current_ticket", current_ticket);
        io.emit("sayat",current_ticket)
    });
    
}); */
function deleteMessage(self) {
    // get message id
    var id = self.getAttribute("data-id");
 
    // send event to server
    io.emit("delete_message", id);
}
// attach listener on client
io.on("delete_message", function (id) {
    // get node by id
    var node = document.getElementById("message-" + id);
    node.innerHTML = "This message has been deleted";
});

});


  
// server should listen from each client via it's socket


// client will listen from server
io.on("new_message", function (data) {
    console.log("Server says", data);
});
app.get("/",function(request,result){
   // result.send("hello sasamssaw");
   result.render("index");
});

// create API for get_message
app.get("/get_messages", function (request, result) {
    connection.query("SELECT * FROM ticket WHERE status='unCalled' ORDER BY id DESC ", function (error, messages) {
        // return data will be in JSON format
        result.end(JSON.stringify(messages));
    });
      //total current
      connection.query("SELECT  id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });
    
});
// create API for get_message
app.get("/get_messages1", function (request, result) {
    connection.query("SELECT  ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        result.end(JSON.stringify(rows));
    });
      //total current
      connection.query("SELECT  id,ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });
});
//total api
app.get("/total_api", function (request, result) {
 
    //total current
    connection.query("SELECT  ticketNumber FROM ticket WHERE status='unCalled' ", function (error, rows) {
      // return data will be in JSON format
      total_ticket = rows.length;
      io.emit("total_Number_of_ticket", total_ticket);
  });
});
// all users
app.get("/all",(request,res)=>{

  connection.query("SELECT  * FROM users ",
  (err,result)=> {
      if(err){
          res.send({err:err});

      }
      if(result.length > 0){
        //res.send({result});
      res.send(JSON.stringify(result));
      }
      else{
          
        res.send({message:"wrong username/password Combination"});
          
      }
    
});

});

// Login
app.post("/login",(request,res)=>{
  const username=request.body.username;
  const password = request.body.password;

  connection.query("SELECT  * FROM users WHERE username = ? AND password = ?",[username,password],
  (err,result)=> {
      if(err){
          res.send({err:err});

      }
      if(result.length > 0){
        res.send({result});
     //  res.send(JSON.stringify(result));
      }
      else{
          
        res.send({message:"wrong username/password Combination"});
          
      }
    
});

});
app.get('/user',(req,res,next)=>{
  var sql =  "SELECT  * FROM users WHERE role='user' ";
	 connection.query(sql, function(err, results){	
    if(results != ""){
      console.log("samisams");
    }

   });

});
//registr2
app.post('/login3',(req,res,next)=>{
var username=req.body.username;
 	var pass= req.body.password;
 	var dec_pass =atob(pass);
//	var encrypted_pass = cryptr.encrypt(dec_pass);
    var encrypted_pass = cryptr.encrypt(dec_pass);
	// var sql="SELECT * FROM 'users' WHERE 'username'='"+username+"' and password = '"+encrypted_pass+"'";
     var sql =  "SELECT  * FROM users WHERE username='"+username+"' and password = '"+pass+"'";
	 connection.query(sql, function(err, results){	
		 if(results != ""){
			 
			 console.log(JSON.stringify(results));
			 
			 var data = JSON.stringify(results);
			 
			 var secret = 'TOPSECRETTTTT';
				var now = Math.floor(Date.now() / 1000),
					iat = (now - 10),
					expiresIn = 3600,
					expr = (now + expiresIn),
					notBefore = (now - 10),
					jwtId = Math.random().toString(36).substring(7);
				var payload = {
					iat: iat,
					jwtid : jwtId,
					audience : 'TEST',
					data : data
				};	
				
			 
			 jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn : expiresIn}, function(err, token) {
					
				if(err){
					console.log('Error occurred while generating token');
					console.log(err);
					return false;
				}
				 else{
				if(token != false){
					//res.send(token);
					res.header();
				
            res.status(200).send({
            	results:
  								{"status": "true"},
  						token : token,
                    
					   	data : data,
              username: data.username,
              id:data.id
            });
            console.log("user"+username)			;
            
					res.end();
				}
				else{
					res.send("Could not create token");
					res.end();
				}
				
				 }
			});
		
		 }
		 else {
			 	console.log("not a user");
                   return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
		 }
	 });

/////
    
});


//lonin2
app.post('/login2', (req, res, next) => {
    const username=req.body.username;
    const password = req.body.password;
    connection.query(
        "SELECT  * FROM users WHERE username = ? AND password = ?",[username,password],
      (err, result) => {
        // user does not exists
        if (err) {
        //  throw err;
         /* return res.status(400).send({
            msg: err
          }); */
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
        if (!result.length) {
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
        // check password
          req.body.password,
          result[0]['password'],
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              throw bErr;
              return res.status(401).send({
                msg: 'Username or password is incorrect!'
              });
            }
            if (bResult) {
              const token = jwt.sign({
                  username: result[0].username,
                  userId: result[0].id
                },
                'SECRETKEY', {
                  expiresIn: '7d'
                }
              );
              connection.query(
                'UPDATE users SET last_login = now() WHERE id = "${result[0].id}"'
              );
              return res.status(200).send({
                msg: 'Logged in!',
                token,
                user: result[0]
              });
            }
            return res.status(401).send({
              msg: 'Username or password is incorrect!'
            });
          }
        
      }
    );
  });
//create-account
app.post("/register",(request, result)=>{
    const password= request.body.password
    var dec_pass =atob(password);
    var encrypted_pass = cryptr.encrypt(dec_pass);
    const username = request.body.username
    

    connection.query("INSERT INTO users (username,password) VALUES (?,?)", [username,encrypted_pass],
     (error, result)=> {
        console.log(error)
    });
});

//app.post(create_account,function(request,result){

//});
//get active user
//list all customer 
app.get("/list_all_users", function (request, result) {
    connection.query("SELECT  * FROM users   ", function (error, rows) {
        // return data will be in JSON format
        result.end(JSON.stringify(rows));
    });
  
});
//

//start print

