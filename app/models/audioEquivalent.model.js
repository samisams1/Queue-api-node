module.exports = (sequelize, Sequelize) => {
  const AudioEquivalent = sequelize.define("audioEquivalent", {
   id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    value: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    audioAddress: {
      type: Sequelize.STRING
    }
  });

  return AudioEquivalent;
};
