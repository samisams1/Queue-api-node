const { verifyToken } = require('../authenticate')
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  database: "queedb"
});
var dateFormat = require('dateformat');
var time=dateFormat(new Date(), "yyyy-mm-dd");
const SocketIO = io => {
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
    io.on('connect', socket => {

        socket.on('new-message22', function(newMessage) {
            io.emit('new-message22',{mesage:socket.username})
        //    console.log(newMessage)
          //  console.log(socket.username)
        });

        //start old
        // this is socket for each user
    let today = new Date().toISOString();

   // var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");

    //console.log("User connected", socket.id);
    //console.log('hello!', socket.handshake.decoded_token.name);

/*    socket.on('message',(data)=>{
        console.log(data);
        console.log("sasaw");
        const currenttcket = 500;
        socket.emit('samisams',currenttcket);
      });

    socket.on("insertNew",function(data){
      connection.query("INSERT INTO tickets (ticketNumber,status) VALUES ('44','unCalled')", function (error, result) {
    // server will send message to all connected clients
   id =  result.insertId;
    io.emit("new_message",  id,data);
});




});
*/
/*
socket.on("new_message", function (data,dedicateId) {
console.log("Client says", data);

// save message in database
connection.query("INSERT INTO tickets (ticketNumber,status,updatedBy,dedcatedWindow,createdDate) VALUES ('" +data+ "','unCalled','5','"+28+"','"+today+"')", function (error, result) {
    // server will send message to all connected clients
   id =  result.insertId;
    io.emit("new_message",  id,data);
});

connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
    // return data will be in JSON format
    total_ticket = rows.length;
    io.emit("total_Number_of_ticket", total_ticket);
});

});
*/
//get ticket mobile
/*socket.on("get_ticket", function (data) {
  // save message in database
  serviceId = data;
  console.log("sasaw");
  console.log(data);
  console.log("kebede");
  connection.query("SELECT * FROM tickets WHERE id =( SELECT MAX(id)  FROM tickets limit 1) ", function (error, rows) {
    // return data will be in JSON format

    ticketNumber = rows[0].ticketNumber;
    newTicketNumber = ticketNumber + 1;
    console.log(rows[0].id);
    console.log(rows[0].ticketNumber);
    connection.query("INSERT INTO tickets (ticketNumber,status,updatedBy,dedcatedWindow,createdDate,createdBy,windowNumber,serviceId) VALUES ('" +newTicketNumber+ "','unCalled','5','"+28+"','"+today+"','"+data+"','wait','"+serviceId+"')", function (error, result) {
      // server will send message to all connected clients
     id =  result.insertId;
      io.emit("get_ticket",  id,data);

  });
});
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
      // return data will be in JSON format
      total_ticket = rows.length;
      io.emit("total_Number_of_ticket", total_ticket);
  });

});*/

socket.on("call_queue",function(userId){
  connection.query("SELECT  id,ticketNumber,updatedBy FROM tickets WHERE status='unCalled' LIMIT 1 ", function (error, rows) {
    // return data will be in JSON format
    if(rows.length > 0){
var  id = rows[0].id;
//var userId=  playMsg.userId;

    connection.query("UPDATE  tickets SET  status ='playing',updatedBy= '"+userId+"', windowNumber = '"+1+"', updatedDate ='"+time+"'  WHERE id = '" +id+ "'", function (error, result) {
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='playing' ", function (error, rows) {
        // return data will be in JSON format
        totalPlaying = rows.length;
        io.emit("totalPlaying", totalPlaying);
        console.log("mom" + totalPlaying)
    });
    });
     //current
     connection.query("SELECT id,ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 1", function (error, rows) {
      // return data will be in JSON format
      if(rows.length >0){
        current_ticket = rows[0].ticketNumbe;
        // io.emit("current_ticket", current_ticket);
         socket.join(userId);
         io.to(userId).emit("current_ticket", current_ticket);
      }else{
        current_ticket = 0;
         socket.join(userId);
         io.to(userId).emit("current_ticket", current_ticket);
      }

  });

  };
});

});

//
socket.on("call_queue_again",function(userId){
    // return data will be in JSON format
  connection.query("SELECT  id,ticketNumber,updatedBy FROM tickets WHERE status='called'  ORDER BY id DESC LIMIT 1 ", function (error, rows) {
    // return data will be in JSON format
    if(rows.length > 0){
var  id = rows[0].id;
//var userId=  playMsg.userId;

    connection.query("UPDATE  tickets SET  status ='playing',updatedBy= '"+userId+"',updatedDate ='"+time+"'  WHERE id = '" +id+ "'", function (error, result) {
      connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='playing' ", function (error, rows) {
        // return data will be in JSON format
        totalPlaying = rows.length;
        io.emit("totalPlaying", totalPlaying);
        console.log("mom" + totalPlaying)
    });
    });
     //current
     connection.query("SELECT id,ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 1", function (error, rows) {
      // return data will be in JSON format
      if(rows.length >0){
        current_ticket = rows[0].ticketNumber;
        // io.emit("current_ticket", current_ticket);
         socket.join(userId);
         io.to(userId).emit("current_ticket", current_ticket);
      }else{
        current_ticket = 0;
         socket.join(userId);
         io.to(userId).emit("current_ticket", current_ticket);
      }

  });
  };
});

});


socket.on("play", function(playMsg) {
// delete from database
// connection.query("SELECT  id FROM ticket WHERE status='unCalled' WHERE id > '"+465+"''ORDER BY id ASC LIMIT 1", function (error, rows) {
connection.query("SELECT  id,ticketNumber,updatedBy FROM tickets WHERE status='playing' LIMIT 1 ", function (error, rows) {
    // return data will be in JSON format
    if(rows.length > 0){
var  id = rows[0].id;
var data = rows[0].ticketNumber;
var updatedBy = rows[0].updatedBy;
var userId=  playMsg.userId;

console.log("samsi" + playMsg.userId)
var timestamp = new Date().getTime();
// var audio = rows[0].audioNumber;
// io.emit("deleteTicket",id,data,audio);
    connection.query("UPDATE  tickets SET  status ='called' WHERE id = '" +id+ "'", function (error, result) {
        // send event to all users

   //     io.emit("deleteTicket",id,data,audio);
    });
    //ticteNumber Audio
    connection.query("SELECT value,audioAdress FROM audioequivalents WHERE value='"+data+"' ORDER BY id DESC LIMIT 1", function (error, aodioRows) {
        // return data will be in JSON format

        var audio = aodioRows[0].audioAdress;
       // io.emit("deleteTicket",id,data,audio);

    });

    connection.query("SELECT value,audioAdress FROM audioequivalents WHERE value='"+updatedBy+"' ORDER BY id DESC LIMIT 1", function (error, windowRows) {

    });

    //total
    connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });

    connection.query("SELECT  ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.ticketNumber;
        io.emit("deleteTicket", id);
    });
       // first ten
connection.query("SELECT  ticketNumber,updatedBy FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
    // return data will be in JSON format
    c1 = rows.length;
    first_ten_ticket=rows;

   io.emit("first_ten_ticket", first_ten_ticket,c1);
});
    }
});

// Daily total
connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
    total_ticket = rows.length;
    io.emit("total_Number_of_ticket", total_ticket);
});
 //daily Served Queue
 connection.query("SELECT  id,ticketNumber,createdDate,updatedDate FROM tickets WHERE (status='called' AND updatedDate='"+today+"' ) ORDER BY id DESC ", function (error, rows) {
  if( rows.length>0){
     total = rows.length;
     DailyQueue=rows;
     io.emit("DailyQueue", DailyQueue,total);
     console.log(today)
     console.log("today")
  }

 });

});
//daily served
socket.on("stop",msg=>io.emit("stop"))

//start audio 2
socket.on("play1", function(playMsg) {

  connection.query("SELECT  id,ticketNumber,updatedBy FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 1 ", function (error, rows) {
    // return data will be in JSON format
    if(rows.length>0){
      var  id = rows[0].id;
      var data = rows[0].ticketNumber;
      var audioNum = playMsg.current_ticket;
      var updatedBy = rows[0].updatedBy;
      var userId=  playMsg.userId

      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);

      //console.log("samsi" + playMsg.userId)
      var timestamp = new Date().getTime();

          //ticteNumber Audio
          connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='playing' ", function (error, rows) {
            // return data will be in JSON format
            totalPlaying = rows.length;
            io.emit("totalPlaying", totalPlaying);
            console.log("mom" + totalPlaying)
        });
          connection.query("SELECT value,audioAdress FROM audioequivalents WHERE value='"+data+"' ORDER BY id DESC LIMIT 1", function (error, aodioRows) {
              var audioAdress = aodioRows[0].audioAdress;
             // io.emit("play1",{name:"music two",path1:audioAdress});
              io.emit("play1", {
                name: 'play1',path:audioAdress
                            });

        console.log("best"+ audioAdress);
          })
          // current ticket of all value
  connection.query("SELECT id,ticketNumber FROM tickets WHERE status='called ' ORDER BY id DESC LIMIT 1", function (error, rows) {
        // return data will be in JSON format
        if(rows.length >0){
          //new user logic
         // socket.join(userId);
          current_ticket = rows[0].ticketNumber;
          io.emit("current_ticket", current_ticket);
          io.emit("current_ticket_from_all", current_ticket);
      //start customer before for diatal ticket
      console.log("tizita ");
      /*  console.log(id);
      connection.query("SELECT branchId,serviceId FROM tickets WHERE id = '"+id+"'    ", function (error, rows) {
           if( rows.length > 0){
                console.log("branchId");
             console.log( rows[0].branchId);
             total_ticket = rows.length;
              var  branchId= rows[0].branchId;
              var  serviceId=     rows[0].serviceId;

              connection.query("SELECT  id,ticketNumber FROM tickets WHERE   serviceId = '"+serviceId+"' AND branchId = '"+branchId+"' AND status='unCalled' AND   id < '"+id+"'    ", function (error, rows) {
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

          }else{
            total_ticket = 0;
            socket.emit("customer_befor_you", total_ticket);
          }

       });*/
      //start customer before for detail ticket

  }else{
    current_ticket = 0;
    io.emit("current_ticket_from_all", current_ticket);

   }
    });
    }


  });


  });
  //stope audio 2
  socket.on("stop1",msg=>io.emit("stop1"))

  //play sound 3
  socket.on("play2", function(playMsg) {
    connection.query("SELECT  id,ticketNumber,updatedBy FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 1 ", function (error, rows) {
    var  id = rows[0].updatedBy;
    console.log("kalsi");
      console.log(id);
      console.log("kalsi");
    connection.query("SELECT id,ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 1", function (error, rows) {
      // return data will be in JSON format
      current_ticket = rows[0].ticketNumber;
     // io.emit("current_ticket", current_ticket);
      socket.join(id);
      io.to(id).emit("current_ticket", current_ticket);
   //customer before you start
      connection.query("SELECT * FROM tickets WHERE branchId = '"+1+"' AND serviceId = '"+1+"'  AND status='unCalled'  ", function (error, resualtcby) {
        total_ticket  = resualtcby.length;
        console.log("mamuya");
        console.log(total_ticket);
        io.emit("customer_befor_you", total_ticket);
      });
   //customer before you start
    });

    connection.query("SELECT  id,ticketNumber,createdDate,updatedDate FROM tickets WHERE (status='called' AND updatedDate='"+today+"' ) ORDER BY id DESC ", function (error, rows) {
      if( rows.length>0){
         total = rows.length;
         DailyQueue=rows;
         io.emit("DailyQueue", DailyQueue,total);
         console.log(today)
         console.log("today")
      }});

    io.emit("play2",playMsg);

  });
    connection.query("SELECT * FROM tickets WHERE status = 'unCalled'    ", function (error, rows) {
      console.log("samisams kidis");
      console.log(rows.length);
      var  id = rows[0].id;
      console.log(id);
    });
    });
    // stope sound 3
    socket.on("stop2",msg=>io.emit("stop2"))

     //play sound 4
  /*socket.on("play3", function(playMsg) {
  //  io.emit("play3",playMsg);
    var userId=  playMsg.userId
    connection.query("SELECT  id,windowNumber FROM users WHERE id ='"+userId+"'  ", function (error, rows) {
      // return data will be in JSON format
  //var  id = rows[0].id;
  windowNumber  =  rows[0].windowNumber;
  console.log("username" + windowNumber);
  //console.log("samsi" + playMsg.userId)
  var timestamp = new Date().getTime();

      //ticteNumber Audio
      connection.query("SELECT value,audioAdress FROM audioequivalents WHERE value='"+windowNumber+"' ORDER BY id DESC LIMIT 1", function (error, aodioRows) {
          var audioAdress = aodioRows[0].audioAdress;
         // io.emit("play1",{name:"music two",path1:audioAdress});
          io.emit("play3", {
            name: 'Gildo',path:audioAdress
                        });

    console.log("best"+ audioAdress);
      })
    });


    }); */
    //////////////////////////////
    socket.on("play3", function(playMsg) {
      connection.query("SELECT  id,ticketNumber,updatedBy FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 1 ", function (error, rows) {
        // return data will be in JSON format
    var  id = rows[0].updatedBy;
   /* connection.query("SELECT id,ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 1", function (error, rows) {
      // return data will be in JSON format
      current_ticket = rows[0].ticketNumber;
     // io.emit("current_ticket", current_ticket);
      socket.join(id);
      io.to(id).emit("current_ticket", current_ticket);
    });*/
    connection.query("SELECT  id,windowNumber FROM users WHERE id ='"+id+"'  ", function (error, rows) {
      // return data will be in JSON format
  //var  id = rows[0].id;
  windowNumber  =  rows[0].windowNumber;
  console.log("username" + windowNumber);
  //console.log("samsi" + playMsg.userId)
  var timestamp = new Date().getTime();

      //ticteNumber Audio
      connection.query("SELECT value,audioAdress FROM audioequivalents WHERE value='"+windowNumber+"' ORDER BY id DESC LIMIT 1", function (error, aodioRows) {
          var audioAdress = aodioRows[0].audioAdress;
         // io.emit("play1",{name:"music two",path1:audioAdress});
          io.emit("play3", {
            name: 'Gildo',path:audioAdress
                        });

    console.log("best"+ audioAdress);
      })
    });

      });


      });
    /////////////////////
    // stope sound 4
    socket.on("stop3",msg=>io.emit("stop3"))
     //play sound 5
  socket.on("play4", function(playMsg) {
    io.emit("play4",playMsg);


    });
    // stope sound 5
    socket.on("stop4",msg=>io.emit("stop4"))


//play sound
socket.on("play",playMsg=>{
io.emit("play",playMsg);
});


socket.on("totalPlaying", function () {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='playing' ", function (error, rows) {
      // return data will be in JSON format
      totalPlaying = rows.length;
      io.emit("totalPlaying", totalPlaying);
      console.log("mom" + totalPlaying);
  });
});

// attach listener to server
socket.on("delete_message", function (messageId) {
    // delete from database
    connection.query("UPDATE  tickets SET status ='called' WHERE id = '" + messageId + "'", function (error, result) {
        // send event to all users
        io.emit("delete_message", messageId);
    });
    //current
    connection.query("SELECT MAX(id) id,ticketNumber FROM tickets WHERE status='called' ", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        //io.emit("current_ticket", current_ticket);
         socket.join(userId);
      io.to(userId).emit("current_ticket", current_ticket);
    });

    // first ten
    connection.query("SELECT  ticketNumber,updetedBy FROM tickets WHERE status='unCalled' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        c1 = rows.length;
        first_ten_ticket=rows;
        io.emit("first_ten_ticket", first_ten_ticket,c1);
    });
    //total
    connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        io.emit("total_Number_of_ticket", total_ticket);
    });
});

   // current ticket number
   socket.on("current_ticket", function (userId) {

    connection.query("SELECT id,ticketNumber FROM tickets WHERE status='called 'AND updatedBy='"+userId+"'  ORDER BY id DESC LIMIT 1", function (error, rows) {
        // return data will be in JSON format
        if(rows.length >0){
          //new user logic
          socket.join(userId);
          current_ticket = rows[0].ticketNumber;
        //  io.emit("current_ticket", current_ticket);
          io.to(userId).emit("current_ticket", current_ticket);
  }else{
    current_ticket = 0;
    io.to(userId).emit("current_ticket", current_ticket);

   }
    });

});
// currnt queue from all casher
 socket.on("current_ticket_from_all", function () {

    connection.query("SELECT id,ticketNumber FROM tickets WHERE status='called ' ORDER BY id DESC LIMIT 1", function (error, rows) {
        // return data will be in JSON format
        if(rows.length >0){
          //new user logic
         // socket.join(userId);
          current_ticket = rows[0].ticketNumber;
        //  io.emit("current_ticket", current_ticket);
          io.emit("current_ticket_from_all", current_ticket);
  }else{
    current_ticket = 0;
    io.emit("current_ticket_from_all", current_ticket);

   }
    });

});
//current queeue
 // current ticket number
 /*socket.on("get_current_id", function (current_ticket) {
    connection.query("SELECT MIN(id) id,ticketNumber FROM ticket WHERE status='called' ", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        io.emit("get_current_id", current_ticket);
    });

});  */


// total ticket number
socket.on("total_Number_of_ticket", function (total_ticket) {
    connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
        // return data will be in JSON format
        total_ticket = rows.length;
        socket.emit("total_Number_of_ticket", total_ticket);
        io.emit("Number_of_customer_before", total_ticket);
    });

});

 socket.on('message',(data)=>{
        console.log(data);
        console.log("sasaw");
        const currenttcket = 500;


        connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
            // return data will be in JSON format
            total_ticket = rows.length;
            socket.emit("total_Number_of_ticket", total_ticket);
            io.emit("Number_of_customer_before", total_ticket);
            //socket.emit('samisams',total_ticket);
        });
      });

// total DaileyQueue
socket.on("totalDailyQueue", function (total_ticket) {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
      // return data will be in JSON format
      total_ticket = rows.length;
      io.emit("totalDailyQueue", dailyQueue_ticket);
  });

});

// total window number
socket.on("totalWindow", function (totalWindow) {
    connection.query("SELECT  id FROM windownumbers  ", function (error, rows) {
        // return data will be in JSON format
        totalWindow = rows.length;
        io.emit("totalWindow", totalWindow);
    });

});
// current Window
socket.on("specific_Window", function (myuserId) {
  connection.query("SELECT  windowNumber FROM users WHERE id = '"+myuserId+"'  LIMIT 1", function (error, rows) {
    if(rows.length>0){
      windowId = rows[0].windowNumber
      connection.query("SELECT  windowNumber FROM windownumbers WHERE id = '"+windowId+"'  LIMIT 1", function (error, rows1) {
      // if(rows1.length>0){
        window = rows[0].windowNumber;
        io.emit("specific_Window", window);
      // }

    });
    }
});


});
// Total Daily Queue All User
socket.on("totalDailyQueueAllUser", function (daily_all_user_queue) {
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var month = date.getUTCMonth() + 1;
  const year = date.getFullYear();
  var day = date.getUTCDate();
  connection.query("SELECT updatedDate,status FROM tickets WHERE (year(updatedDate) = '"+year+"' AND status = 'called' AND month(updatedDate)='"+month+"' AND day(updatedDate)='"+day+"') ",function (error, rows) {
        // return data will be in JSON format
        daily_all_user_queue = rows.length;
        io.emit("totalDailyQueueAllUser", daily_all_user_queue);
    });

});
// total ticket number of Month
socket.on("totalMonthQueue", function (total_ticket) {
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var month = date.getUTCMonth() + 1;
  const year = date.getFullYear();
 // connection.query("SELECT   MONTH(updatedDate) AS  start_month,  id,updatedDate FROM ticket WHERE  status='called'

 connection.query("SELECT updatedDate,status FROM tickets WHERE (year(updatedDate) = '"+year+"' AND status = 'called' AND month(updatedDate)='"+month+"') ",function (error, rows1) {
    // return data will be in JSON format

    total_ticket = rows1.length;
    io.emit("totalMonthQueue", total_ticket);
    console.log(rows1)
});


});
// total queue year  number
socket.on("totalYearQueue", function (total_ticket) {
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var month = date.getUTCMonth() + 1;
  const year = date.getFullYear();
 // connection.query("SELECT   MONTH(updatedDate) AS  start_month,  id,updatedDate FROM ticket WHERE  status='called'

  connection.query("SELECT updatedDate FROM tickets WHERE year(updatedDate) = '"+year+"' ",function (error, rows1) {
    // return data will be in JSON format
    total_ticket = rows1.length;
    io.emit("totalYearQueue", total_ticket);
    console.log(rows1)
});

});



socket.on("total_Number_of_ticket_perYear", function (userId) {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE(updatedDate between '2021-07-01' and   '"+time+"' AND status='called'  AND updatedBy = '"+userId+"' )", function (error, rows) {
      // return data will be in JSON format
      monthTicket = rows.length;
      io.emit("Monthly_served", monthTicket);
     // io.emit("Number_of_customer_before", total_ticket);
 //   console.log(time + "miku" +monthTicket + "kebede" + firstDay +"presisdenr" + lastDay)
  });

});

//yearly
socket.on("total_Number_of_ticket_perYear", function (userId) {
  const date = new Date();
  const year = date.getFullYear();
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE(  status='called' AND year(updatedDate) = '"+year+"' AND updatedBy = '"+userId+"' )", function (error, rows) {
      // return data will be in JSON format
      yearTicket = rows.length;
      io.emit("total_Number_of_ticket_perYear", yearTicket);
     // io.emit("Number_of_customer_before", total_ticket);
    console.log(time + "sams" +yearTicket)
  });

});
//customer served admin
socket.on("total_customer_served", function (userId) {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE (status='called' AND updatedDate='"+time+"' ) ", function (error, servedRows) {
      // return data will be in JSON format
      TotalServedCustomer = servedRows.length;
      io.emit("total_customer_served", TotalServedCustomer);
    //  console.log("kebede" + userId)
  });

});
socket.on("customer_served", function (userId) {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE (updatedBy = '"+userId+"' AND status='called' AND updatedDate='"+time+"' ) ", function (error, servedRows) {
       // return data will be in JSON format
      if (servedRows.length > 0) {}
      servedCustomer = servedRows.length;
      socket.join(userId);
      io.to(userId).emit("customer_served", servedCustomer);
    console.log("userId" + userId)
    //  console.log("kebede" + userId)
    console.log(time)
    console.log("today")


   });

});
//select first ten ticket number
/*socket.on("first_ten_ticket", function (first_ten_ticket) {
    connection.query("SELECT updatedBy,ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        // return data will be in JSON format
        c1 = rows.length;
        first_ten_ticket=rows;
        io.emit("first_ten_ticket", first_ten_ticket,c1);
        console.log("tade")
    });

}); */
//save socket window
/*socket.on("save_window_number",function(data){
  connection.query("INSERT INTO windownumbers (windowNumber) VALUES ('"+data+"')", function (error, result) {
// server will send message to all connected clients
//id =  result.insertId;
io.emit("save_window_number",data);
});
});
*/
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

socket.on("select_playing", function (select_playing) {
    connection.query("SELECT updatedBy,ticketNumber FROM tickets WHERE status='called' ORDER BY id DESC LIMIT 7  ", function (error, rows) {
        select_playing=rows;
        io.emit("select_playing", select_playing);
    });

});

//report
/*socket.on("DailyQueue", function (DailyQueue) {
  connection.query("SELECT updatedBy,ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC  ", function (error, rows) {
    total = rows.length;
      DailyQueue=rows;
      io.emit("DailyQueue", DailyQueue,total);
  });

});*/

/*
socket.on("is_Ticket_Available", function (total_ticket) {
  console.log(total_ticket);
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' AND createdBy = '"+total_ticket+"' ", function (error, rows) {
      // return data will be in JSON format
      total_ticket = rows.length;
      socket.emit("is_Ticket_Available", total_ticket);
      console.log("total_ticket");
      console.log(total_ticket);
  });

});
*//*
socket.on("list_all_ticket", function (data) {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled' ", function (error, rows) {
      // return data will be in JSON format
      data = rows
      socket.emit("list_all_ticket", data);
      console.log(data);
  });
});
*/
//customer before You
// total ticket number
/*
socket.on("customer_befor_you", function (id) {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled'  AND createdBy < '"+id+"' ", function (error, rows) {
      // return data will be in JSON format
      total_ticket = rows.length;
      socket.emit("customer_befor_you", total_ticket);
     // io.emit("Number_of_customer_before", total_ticket);
  });

});
*/
//get available  queue in service
/*
socket.on("getService", function (serviceId) {
  connection.query("SELECT  id,ticketNumber FROM tickets WHERE status='unCalled'  AND serviceId = '"+serviceId+"' ", function (error, rows) {
      service_queue = rows.length;
      socket.emit("getService", getService);
  });

});
*/






socket.on('disconnect',()=>{
  io.emit('message','A user has left the chat');
//  console.log("disconnet")
})
        //end old
      //  console.log('Connnected To Socket')
        socket.on('disconnect', () => console.log('Disconnected'))
    })
}

module.exports = SocketIO
