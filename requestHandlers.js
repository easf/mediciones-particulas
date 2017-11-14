var net = require('net');
var fs = require('fs');
var config = require('./config');
const readLastLine = require('read-last-line');

const REQUIREDROWS = 289;

function start ( req, res ) {
    console.log ( "Request handler 'start' was called." );    
    res.render( 'pages/index.html');
}

function pass ( req, res ) {
    console.log ( "Request handler 'pass' was called." );  
    var sess = req.session;
    if (sess && sess.pass){
            res.redirect('/power');    
        
    } else {
        res.render( 'pages/password.html');
    } 
    
}

function reset ( req, res ) {
    console.log ( "Request handler 'resetPass' was called." ); 
    var success = false;
    if (req.body.key){
        fs.writeFile('serverData/key', req.body.key, (err) => {
            if (err) throw err;
            console.log(' Key access was updated succesfully');
        });
        success = true;
    } else if (req.body.corrFactor){
        fs.readFile('serverData/factors', (err, factors) => {
            if (err) throw err;
            var factorValues = factors.toString().split(',');
            factorValues[0] = req.body.corrFactor;
            fs.writeFile('serverData/factors', factorValues.join(), (err) => {
                if (err) throw err;
                console.log(' Correction factor was updated succesfully');
            });
        });
        success = true;    
    } else if (req.body.qFactor){
        fs.readFile('serverData/factors', (err, factors) => {
            if (err) throw err;
            var factorValues = factors.toString().split(',');
            factorValues[1] = req.body.qFactor;
            fs.writeFile('serverData/factors', factorValues.join(), (err) => {
                if (err) throw err;
                console.log(' Quality factor was updated succesfully');
            });
        });
        success = true;
    }


    if (success){
        res.writeHead( 200, { "Content-Type": "text/html" } );
        res.write("Actualización exitosa");
    } else {
        res.writeHead( 500, { "Content-Type": "text/html" } );
        res.write("Error en la actualización");        
    }
    res.end();
}

function secureRedirect ( req, res ) {
    console.log ( "Request handler 'power' was called." );    
    var sess=req.session;
    fs.readFile('serverData/key', (err, readKey) => {
        if (err) throw err;    
        if ( req.body.key.toString() === readKey.toString() ){
            sess.pass=readKey.toString();
            res.redirect('/power');
        } else {
            res.render( 'pages/fail.html', { id: 'pass'} );
        }
    });

}

function power ( req, res ) {
    console.log ( "Request handler 'power' was called." );
    var sess=req.session;
    if (sess && sess.pass){
        res.render( 'pages/power.html');    
    } else {
        res.redirect('/pass');
    }     
    
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
            
            if (data.toString().indexOf("OK") > -1){
                
                /***
                    Si llega la respuesta OK del medidor se actualiza la hora de inicio de las mediciones
                ***/
                fs.writeFile('serverData/startDateTime', currentDateTimeMilliseconds, (err) => {
                    if (err) throw err;
                    var currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
                    console.log( currentDateTime + ' Start date was updated succesfully');
                });

                res.render( "pages/success.html", { id:'start' } );

            } else {
                res.render( "pages/fail.html", { id:'start' } );
            }
            client.destroy(); // kill client after server's response
        });


    } else {
        command = 'MSTOP\r';

        /***
            Evento de recepcion de respuesta del medidor
        ***/
        client.on('data', function(data) {
            
            if (data.toString().indexOf("OK") > -1){
                res.render( "pages/success.html", { id:'stop'} );
            }else{
                res.render( "pages/fail.html", { id:'stop'});
            }
            client.destroy(); // kill client after server's response
        });

    }


    /***
        En caso de error en la conexion
    ***/
    client.on('error', function(err) {
        currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
        console.log( currentDateTime + err);
        res.render( "pages/fail.html", { id:'noConnection'});
    });

    /***
            Conexion con el medidor
    ***/
    client.connect(config.measurer_port, config.measurer_ip_address, function() {
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


function updateAirStatus (req, res){
    var dateTime = new Date();
    var currentYear = dateTime.getFullYear();
    var fileName = 'mediciones/mediciones-' + currentYear + '.csv';

    readLastLine.read(fileName, REQUIREDROWS).then(function (lines) {
        
        lines = lines.split('\n');
        
        if (lines.length < REQUIREDROWS) {
            var previousYear = currentYear - 1;
            var previousFile = 'mediciones/mediciones-' + previousYear + '.csv';        
            readLastLine.read(previousFile, REQUIREDROWS - lines.length).then(function (remLines) {
                remLines = remLines.split('\n');
                
                lines = lines.concat(remLines);
                
                var currentLine = "";
                var currentValue = "";
                var cMedSum = 0;
                var count = 0;
                for (var i = lines.length - 1; i >= 0; i--) {
                    currentLine = lines[i];
                    if (currentLine.length > 0){
                        currentValue = currentLine.split(',').slice(-1)[0];
                            cMedSum = cMedSum + Number(currentValue);
                            count++;
                    }
                }
                cMedSum = cMedSum.toFixed(10);
                
                fs.readFile('serverData/factors', (err, factors) => {
                    if (err) throw err;    
                    var factorValues = factors.toString().split(',');
                    var corrFactor = Number(factorValues[0]);
                
                    var cProm = cMedSum * corrFactor * 1000 / count;
                    var qIndexFactor = Number(factorValues[1]);
                    var ica = (cProm/qIndexFactor) * 100;
                    ica = ica.toFixed(10);   
                
                    fs.readFile('serverData/apiKey', (err, apiKey) => {
                        if (err) throw err;    
                        res.render( 'pages/airStatus.html', {key: apiKey, value: ica});     
                    });
                    
                });
            });
        }


    }).catch( function(err) {
        console.log(err);
    });    
    
}

exports.start = start;
exports.pass = pass;
exports.power = power;
exports.secureRedirect = secureRedirect;
exports.reset = reset;
exports.updateServerOperationStatus = updateServerOperationStatus;
exports.updateAirStatus = updateAirStatus;
