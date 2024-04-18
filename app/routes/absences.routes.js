const validate = require("../modules/Auth.js").isAuthenticated;

module.exports = (app) => {
  const absence = require("../controllers/absences.controller.js");

  var router = require("express").Router();

  router.post("/update-status-clocked", validate, absence.updateClocked);
  router.post("/retrieve-absence",validate, absence.findOne);
  router.post("/retrieve-all-absences", validate, absence.findAll);
  router.post("/retrieve-absences-users", validate, absence.findAllByUserName);

  app.use("/", router);
};
