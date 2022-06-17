const SqlString = require("mysql/lib/protocol/SqlString");

module.exports = (sequelize, Sequelize) => {
  const Service = sequelize.define("services", {
    value: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    branchId: {
      type: Sequelize.INTEGER,
     // references:'branchs', // <<< Note, its table's name, not object name
     // referencesKey: 'id' // <<< Note, its a column name
}
    

  });

  return Service;
};
