const { authJwt } = require("../middleware");
const controller = require("../controllers/push_notification.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/api/SendNotification",controller.SendNotification
  );
   app.post(
    "/api/SendNotificationToDevice",controller.SendNotificationToDevice
  );
};
