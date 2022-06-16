

const { verifyToken } = require('../authenticate')
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  //  database: process.env.DATABASE
  database: "queedb"
});
/*var dateFormat = require('dateformat');
var time=dateFormat(new Date(), "yyyy-mm-dd");
const anAuthenticate = io => {
  //  const io = require('socket.io')();
   
    io.on('connection', socket => {
    
        socket.on('new-message22', function(newMessage) {
            io.emit('new-message22',{mesage:socket.username})
            console.log(newMessage)
            console.log(socket.username)
        });

        //start old
        // this is socket for each user
    let today = new Date().toISOString();

   // var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
   
    console.log("User connected", socket.id);
    //console.log('hello!', socket.handshake.decoded_token.name);
   
    socket.on("insertNew",function(data){
      connection.query("INSERT INTO tickets (ticketNumber,status) VALUES ('44','unCalled')", function (error, result) {
    // server will send message to all connected clients
   id =  result.insertId;
    io.emit("new_message",  id,data);
});


});


//select first ten ticket number
socket.on("first_ten_ticket", function (first_ten_ticket) {
    connection.query("SELECT updatedBy,ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON formatz
        c1 = rows.length;
        first_ten_ticket=rows;
        io.emit("first_ten_ticket", first_ten_ticket,c1);
        console.log("tade");
    });
    
});

socket.on('disconnect',()=>{
  io.emit('message','A user has left the chat');
  console.log("disconnet")
})
        //end old
        console.log('Connnected To Socket')
        socket.on('disconnect', () => console.log('Socket Disconnected'))
    })
}

module.exports = anAuthenticate
*/