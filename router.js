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

router.route("/reset")
  .post(requestHandlers.reset);

router.route("/power")
  .get(requestHandlers.power)
  .post(requestHandlers.secureRedirect);

  
router.route("/status")
  .post(requestHandlers.updateServerOperationStatus);


router.route("/air")
  .get(requestHandlers.updateAirStatus);

router.use(express.static(__dirname + "/"));
router.use('/mediciones', serveIndex(__dirname + '/mediciones', {'icons': true}));

module.exports = router;
