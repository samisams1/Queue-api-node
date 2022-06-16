const db = require("../models");
const config = require("../config/auth.config");
const sequelize = db.sequelize;
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
exports.userProfile = (req, res) => {
  res.status(200).send({message: "Authorized User!"});
};
exports.allUsers = (req, res) => {
  User.findAll({
 }).then(data => {
  res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
}
