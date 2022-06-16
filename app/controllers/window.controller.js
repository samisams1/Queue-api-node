const db = require("../models");
const config = require("../config/auth.config");
const sequelize = db.sequelize;
const Window = db.windowNumber;

exports.allWindow = (req, res) => {
    Window.findAll({
   }).then(data => {
    res.send(data);
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
}

exports.saveWindow = (req, res) => {

  Window.create({
    value: req.body.winNumber,
  });
   

}

