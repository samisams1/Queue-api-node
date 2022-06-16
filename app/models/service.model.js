module.exports = (sequelize, Sequelize) => {
  const Service = sequelize.define("services", {
    value: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    }
  });

  return Service;
};
