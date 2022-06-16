const { authJwt } = require("../middleware");
const controller = require("../controllers/branch.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
   app.get(
    "/api/allBranch",controller.allBranch
  );
   app.post(
    "/api/saveBranch",controller.saveBranch
  );
};
