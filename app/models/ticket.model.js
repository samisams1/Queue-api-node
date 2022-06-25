module.exports = (sequelize, Sequelize) => {
  const Ticket = sequelize.define("ticket", {

      ticketNumber:{
         type: Sequelize.INTEGER
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
      ticket_before:{
         type: Sequelize.INTEGER
      },
      updatedBy:{
        type:Sequelize.STRING
      },
      cratedBy:{
        type:Sequelize.STRING
      },

    });


  return Ticket;
};
