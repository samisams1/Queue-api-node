const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize = sequelize;


db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.ticket = require("../models/ticket.model.js")(sequelize,Sequelize);
db.windowNumber=require("../models/windowNumber.model.js")(sequelize,Sequelize);
db.audioEquivalent=require("../models/audioEquivalent.model.js")(sequelize,Sequelize);
db.service=require("../models/service.model.js")(sequelize,Sequelize);
db.branch=require("../models/branch.model.js")(sequelize,Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
//db.user.hasMany(ticket, {foreignKey: 'id'});
//db.ticket.belongsTo(user, {foreignKey: 'updatedBy'});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
