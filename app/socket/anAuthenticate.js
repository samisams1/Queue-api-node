var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  database: "queedb"
});
var dateFormat = require('dateformat');
var time=dateFormat(new Date(), "yyyy-mm-dd");
const anAuthenticate = io => {
   
    io.on('connection', socket => {
    
    let today = new Date().toISOString();
    console.log("User connected", socket.id);
socket.on("first_ten_ticket", function (first_ten_ticket) {
    connection.query("SELECT updatedBy,ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        c1 = rows.length;
        first_ten_ticket=rows;
        io.emit("first_ten_ticket", first_ten_ticket,c1);
        console.log("tade");
    });
    
});

/*socket.on('disconnect',()=>{
  io.emit('message','A user has left the chat');
  console.log("disconnet")
})*/
        //end old
        console.log('Connnected To Socket')
        socket.on('disconnect', () => console.log('Socket Disconnected'))
    })
}

module.exports = anAuthenticate