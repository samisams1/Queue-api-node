const db = require("../../models");
const config = require("../../config/auth.config");
const sequelize = db.sequelize;
const Queue = db.ticket;

exports.yearReport = (req, res) => {
  

    Queue.findAndCountAll({

 where: {
            status: 'called',    
          },
        group:[[sequelize.fn('date_format', sequelize.col("updatedDate"), '%Y'), 'updatedDate']]
   }).then(data => {
         var totalqueue = data;  
         console.log("shiftaw")
       console.log(totalqueue)
           res.send(data);
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });

  }

exports.dailyReport = (req,res) =>{
 Queue.findAndCountAll({
        where: {
            status: 'called',    
          },
        group:[[sequelize.fn('date_format', sequelize.col("updatedDate"), '%Y-%m-%d'), 'updatedDate']]
        

    }).then(user => {
         var totalqueue = user.count; 
         console.log("ermi") 
         //console.log(totalqueue)
           res.send(user);
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
}  
exports.monthReport = (req,res) =>{
 Queue.findAndCountAll({
        where: {
            status: 'called',    
          },
        group:[[sequelize.fn('date_format', sequelize.col("updatedDate"), '%Y-%m'), 'updatedDate']]
        

    }).then(user => {
         var totalqueue = user.count; 
         console.log("ermi") 
         //console.log(totalqueue)
           res.send(user);
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
}  
   