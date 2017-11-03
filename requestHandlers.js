var net = require('net');
var fs = require("fs");
var csvWriter = require('csv-write-stream');


function start ( req, res ) {
    console.log ( "Request handler 'start' was called." );    
    res.render( 'pages/index.html');
}

function power ( req, res ) {
    console.log ( "Request handler 'start' was called." );    
    res.render( 'pages/power.html');
}

function updateServerOperationStatus(req, res){

    /***  
        Valor por defecto de command
    ***/
    var command = 'MSTATUS';     
    
    var client = new net.Socket();

    if (req.body.hasOwnProperty('iniciar') ){
        command = 'MSTART\r';
        
        // todo: Registrar fecha y hora
        var currentDateTimeMilliseconds = Date.now();
        

        /***
            Evento de recepcion de respuesta del medidor
        ***/
        client.on('data', function(data) {
            console.log(data);
            if (data.toString().indexOf("OK") > -1){
                
                /***
                    Si llega la respuesta OK del medidor se actualiza la hora de inicio de las mediciones
                ***/
                fs.writeFile('serverData/startDateTime', currentDateTimeMilliseconds, (err) => {
                    if (err) throw err;
                    var currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
                    console.log( currentDateTime + ' Start date was updated succesfully');
                });

                res.render( "pages/startok.html");

            } else {
                res.render( "pages/startfail.html");
            }
            client.destroy(); // kill client after server's response
        });


    } else {
        command = 'MSTOP\r';

        /***
            Evento de recepcion de respuesta del medidor
        ***/
        client.on('data', function(data) {
            console.log(data);
            if (data.toString().indexOf("OK") > -1){
                res.render( "pages/stopok.html");
            }else{
                res.render( "pages/stopfail.html");
            }
            client.destroy(); // kill client after server's response
        });

    }

    /***
            Conexion con el medidor
    ***/
    client.connect(8881, '127.0.0.1', function() {
            console.log('Connected');
            client.write(command);
    });


    /***
            Cierre de conexion con el medidor
    ***/
    client.on('close', function() {
        console.log('Connection closed');
    });
	
}

exports.start = start;
exports.power = power;
exports.updateServerOperationStatus = updateServerOperationStatus;
