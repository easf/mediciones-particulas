/**
 *	Routing file, matching path with request handlers
 */

var express = require("express");
var router = express.Router();
var requestHandlers = require("./requestHandlers");
var serveIndex = require('serve-index');


router.route("/")
  .get(requestHandlers.start);

router.route("/power")
  .get(requestHandlers.power);

router.route("/status")
  .post(requestHandlers.updateServerOperationStatus);

router.use('/mediciones', serveIndex(__dirname + '/measurements'));

module.exports = router;
