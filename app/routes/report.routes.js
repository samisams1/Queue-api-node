const { authJwt } = require("../middleware");
const controller = require("../controllers/Report/report.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
   app.get(
    "/api/test/dailyReport",controller.dailyReport
  );

   app.get(
     "/api/test/monthReport",controller.monthReport
    );
   app.get(
     "/api/test/yearReport",controller.yearReport
    );
};
