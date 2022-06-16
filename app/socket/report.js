const { verifyToken } = require('../authenticate')
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  //  database: process.env.DATABASE
  database: "queedb"
});
var dateFormat = require('dateformat');
var today=dateFormat(new Date(), "yyyy-mm-dd");
const SocketIOR = io => {
  //  const io = require('socket.io')();
    const jwt = require('jsonwebtoken');
   /* io.use(function(socket, next){
      if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, 'bezkoder-secret-key', function(err, decoded) {
          if (err) return next(new Error('Authentication error'));
          socket.decoded = decoded;
          console.log("samson mamushet"+socket.handshake.query.username)
          next();
        });
      } 
      else {
        next(new Error('Authentication error'));
      }    
    })*/
    io.on('connection', socket => {
    
        socket.on("DailyQueue", function (DailyQueue,userId) {
         userId =    socket.handshake.query.userId 
            console.log("sew")
            console.log()
            connection.query("SELECT  id,ticketNumber,createdDate,updatedDate FROM tickets WHERE (status='called' AND updatedDate='"+today+"' AND updatedBy = '"+userId+"' ) ORDER BY id DESC ", function (error, rows) {
             if( rows.length>0){
                total = rows.length;
                DailyQueue=rows;
               // io.emit("DailyQueue", DailyQueue,total);

                socket.join(userId);
                io.to(userId).emit("DailyQueue", DailyQueue,total);
               
             }
               
            });

            
            
          });
          socket.on("first_ten_ticket", function (first_ten_ticket) {
            connection.query("SELECT updatedBy,ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
                // return data will be in JSON format
                c1 = rows.length;
                first_ten_ticket=rows;
                io.emit("first_ten_ticket", first_ten_ticket,c1);
                console.log("tade")
            });
            
        });

          
    });
}
module.exports = SocketIOR