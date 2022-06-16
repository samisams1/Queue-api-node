var http = require("http").createServer(app);
//app.use express(cors());

var express = require('express')
var cors = require('cors')
//var app = express()
//app.use(cors())

app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

//create socket instance with http
var io = require("socket.io")(http);
io.on("connection", function (socket) {
    // this is socket for each user
    let today = new Date().toISOString();

   // var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    var time=dateFormat(new Date(), "yyyy-mm-dd");
    console.log(time + "User connected", socket.id);

   
    
    const printer = require("thermal-printer").types;
   // var printer = require("node-thermal-printer");

  /*  printer.init({
      type: 'epson', // 'star' or 'epson'
     // interface: 'USB-001', // Linux interface
      interface: 'usb-001',
      characterSet: 'UTF-8', // Printer character set
      removeSpecialCharacters: false, // Removes special characters - default: false
      replaceSpecialCharacters: true, // Replaces special characters listed in config files - default: true
    });
    
    printer.isPrinterConnected(function(response) {
      console.log("Printer connected:", response);
      connected = response;
    });
    printer.print("Hello World"); 
    printer.cut();
//   printer.openCashDrawer();

    printer.execute(function(err) {
      if (err) {
        console.error("Print failed", err);
      } else {
        console.log("Print done"); 
      }
    }); 
   */

// var printer = require("./node-thermal-printer");
//
// printer.init({
//   type: 'star',                  // 'star' or 'epson'
//   interface: '/dev/usb/lp0',
//   width: 48,                      // Number of characters in one line (default 48)
//   characterSet: 'SLOVENIA',       // Character set default SLOVENIA
//   removeSpecialCharacters: false, // Removes special characters - default: false
//   replaceSpecialCharacters: true, // Replaces special characters listed in config files - default: true
//   //lineChar: "=",                  // Use custom character for drawing lines
//   // ip: "localhost",
//   // port: 9000
// });
//
// printer.isPrinterConnected(function(response){
//   console.log("Printer connected:", response);
// });
//
//
// printer.alignCenter();
// printer.printImage('./assets/olaii-logo-black-small.png', function(done){
//   printer.alignLeft();
//   printer.newLine();
//   printer.println("Hello World!");
//   printer.drawLine();
//
//   printer.upsideDown(true);
//   printer.println("Hello World upside down!");
//   printer.upsideDown(false);
//   printer.drawLine();
//
//   printer.invert(true);
//   printer.println("Hello World inverted!");
//   printer.invert(false);
//   printer.drawLine();
//
//   printer.println("Special characters: ČčŠšŽžĐđĆćßẞöÖÄäüÜé");
//   printer.drawLine();
//
//   printer.setTypeFontB();
//   printer.println("Type font B");
//   printer.setTypeFontA();
//   printer.println("Type font A");
//   printer.drawLine();
//
//   printer.alignLeft();
//   printer.println("This text is on the left");
//   printer.alignCenter();
//   printer.println("This text is in the middle");
//   printer.alignRight();
//   printer.println("This text is on the right");
//   printer.alignLeft();
//   printer.drawLine();
//
//   printer.setTextDoubleHeight();
//   printer.println("This is double height");
//   printer.setTextDoubleWidth();
//   printer.println("This is double width");
//   printer.setTextQuadArea();
//   printer.println("This is quad");
//   printer.setTextNormal();
//   printer.println("This is normal");
//   printer.drawLine();
//
//   printer.printBarcode("4126570807191");
//   printer.code128("4126570807191", {
//     height: 50,
//     text: 1
//   });
//
//   printer.pdf417("4126565129008670807191");
//   printer.printQR("https://olaii.com");
//
//   printer.newLine();
//
//   printer.leftRight("Left", "Right");
//
//   printer.table(["One", "Two", "Three", "Four"]);
//
//   printer.tableCustom([
//     { text:"Left", align:"LEFT", width:0.5 },
//     { text:"Center", align:"CENTER", width:0.25, bold:true },
//     { text:"Right", align:"RIGHT", width:0.25 }
//   ]);
//
//
//   printer.cut();
//   printer.openCashDrawer();
//   printer.execute();
// });

  // server should listen from each client via it's socket
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
   socket.on("current_ticket", function (current_ticket) {
    connection.query("SELECT id,ticketNumber FROM ticket WHERE status='called' ORDER BY id DESC LIMIT 1", function (error, rows) {
        // return data will be in JSON format
        current_ticket = rows[0].ticketNumber;
        //s1= rows[0].ticketNumber;
        io.emit("current_ticket", current_ticket);
    });
    
}); 
 // current ticket number
 socket.on("get_current_id", function (current_ticket) {
    connection.query("SELECT MIN(id) id,ticketNumber FROM ticket WHERE status='called' ", function (error, rows) {
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