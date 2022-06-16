module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define("ticket", {
    
      ticketNumber:{
         type: Sequelize.STRING
       },
      status: {
        type: Sequelize.STRING
      },
      dedcatedWindow:{
        type:Sequelize.STRING
      },
      updatedDate:{
        type:Sequelize.DATE
      },
      createdDate:{
        type:Sequelize.DATE
      },
      updatedDate:{
        type:Sequelize.DATE
      },
      windowNumber:{
        type:Sequelize.STRING
      },
      updatedBy:{
        type:Sequelize.STRING
      },
     
    });


  return Ticket;
};