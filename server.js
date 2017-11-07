/**
 *  Setting and running the server
 */

var express = require("express");
var router = require("./router");
var APPNAME = require('./package.json').name;
var bodyParser = require('body-parser');
var session = require('express-session');
//var serveIndex = require('serve-index');

function start(server_port, server_ip_address) {

  var app = express();


  /***
    Config app session 
  ***/
  app.use(session({
    secret: 'ledMeasurerShhhh',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  // set the view engine to ejs
  app.set( 'view engine', 'ejs' );
  /***
    For including html files 
  ***/
  app.engine('html', require('ejs').renderFile);
  

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
