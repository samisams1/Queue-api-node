module.exports = (sequelize, Sequelize) => {
  const Branch = sequelize.define("branchs", {
    value: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    }
  });

  return Branch;
};
