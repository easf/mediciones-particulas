#!/usr/bin/env node

/**
 *   Main file
 */

var config = require('./config'); //*** Importing configurations dict.
var server = require("./server"); //*** Wiring with server implementation.

var ServerEnv = function(){
	
    /**
     *  Some server environment settings.
	 */

	self = this;

    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

     /**
      *  Initializes the some server environment settings.
      */
    self.initialize = function() {
        self.setupTerminationHandlers();      
    };
}


/**
 *  main():  Main code.
 */

var serverEnv = new ServerEnv();
serverEnv.initialize();

server.start( config.server_port, config.server_ip_address);