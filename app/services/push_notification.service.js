const e = require("cors");
const { json } = require("express/lib/response");
const { write } = require("fs");
const {ONE_SIGNAL_CONFIG} = require("../config/oneSignal.config");


async function SendNotification(data,callback){
    var headers= {
        'Content-Type': 'application/json', 
        'Authorization': `Basic ${ ONE_SIGNAL_CONFIG.API_KEY}`,
    };
    
    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
      };

   
      var https = require('https');
      var req = https.request(options, function(res) {  
        res.on('data', function(data) {
          console.log("Response:");
          return callback(null,JSON.parse(data));
        });
      });

      req.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
      });
      
      req.write(JSON.stringify(data));
      req.end();
    };
    
module.exports = {SendNotification}