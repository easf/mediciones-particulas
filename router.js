/**
 *	Routing file, matching path with request handlers
 */

var express = require("express");
var router = express.Router();
var requestHandlers = require("./requestHandlers");
var serveIndex = require('serve-index');


router.route("/")
  .get(requestHandlers.start);


router.route("/pass")
  .get(requestHandlers.pass);

router.route("/resetpass")
  .post(requestHandlers.resetPass);

router.route("/power")
  .post(requestHandlers.secureRedirect);

router.route("/power2389564732112838990")
  .get(requestHandlers.power);

router.route("/status")
  .post(requestHandlers.updateServerOperationStatus);


router.use(express.static(__dirname + "/"));
router.use('/measurements', serveIndex(__dirname + '/measurements'));

module.exports = router;
