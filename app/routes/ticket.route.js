const { authJwt } = require("../middleware");
const controller = require("../controllers/ticket.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
   app.get(
    "/api/branchQueue",controller.branchQueue
  );
  app.get(
    "/api/serviceQueue",controller.serviceQueue
  );
};
