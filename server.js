/**
 *  Setting and running the server
 */

var express = require("express");
var router = require("./router");
var APPNAME = require('./package.json').name;
var bodyParser = require('body-parser');
var basicAuth = require('express-basic-auth');
//var serveIndex = require('serve-index');

function start(server_port, server_ip_address) {

  var app = express();

  // set the view engine to ejs
  app.set( 'view engine', 'ejs' );
  /***
    For including html files 
  ***/
  app.engine('html', require('ejs').renderFile);
  
  /***
    Basic authentication
  ***/
  app.use(basicAuth({
    users: { 'admin': 'supersecret' }
  }));

  /**
   *  Support encoding.
   */

  //app.use(bodyParser.json()); //*** Support json encoded bodies.  
  app.use(bodyParser.urlencoded({ extended: true })); // support url encoded.


  /**
   *  Adding routes.
   */
  app.use("/", router);

  /*
   * Adding port, ip and running.
   */
   
  if (typeof server_ip_address === "undefined") { //*** For Localhost or Amazon Web Service Beanstalk

      app.listen (server_port, function () { 
          var address = this.address()
          console.log('%s worker %d running on http://%s:%d', APPNAME, process.pid, address.address, address.port)
        });

    } else { //*** For Openshift

      app.listen( server_port, server_ip_address, function() {
                console.log('%s: Node server started on %s:%d ...',
                            Date(Date.now() ), server_port, server_ip_address);
      });

  }

}

exports.start = start;
