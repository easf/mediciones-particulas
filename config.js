/**
	Configuration file
*/

var config = { }

/**
	Port setting 
*/
					 // default
config.server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8888;

/**
	IP Setting: Just for OPENSHIFT case, for other ones the ip is setted in server.js code
*/

config.server_ip_address = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";


/**
	Make dict "config" accesible
*/
module.exports = config;
