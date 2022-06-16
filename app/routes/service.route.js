const { authJwt } = require("../middleware");
const controller = require("../controllers/service.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
   app.get(
    "/api/allService",controller.allService
  );
   app.post(
    "/api/saveService",controller.saveService
  );
};
