var net = require('net');
var fs = require('fs');
var config = require('./config');


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
        fs.readFile('realTime/factors', (err, factors) => {
            if (err) throw err;
            var factorValues = factors.toString().split(',');
            factorValues[0] = req.body.corrFactor;
            fs.writeFile('realTime/factors', factorValues.join(), (err) => {
                if (err) throw err;
                console.log(' Correction factor was updated succesfully');
            });
        });
        success = true;    
    } else if (req.body.qFactor){
        fs.readFile('realTime/factors', (err, factors) => {
            if (err) throw err;
            var factorValues = factors.toString().split(',');
            factorValues[1] = req.body.qFactor;
            fs.writeFile('realTime/factors', factorValues.join(), (err) => {
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
        if ( req.body.key.toString() === readKey.toString().replace('\n','') ){
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

                fs.writeFile('serverData/stopped', false, (err) => {
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
                fs.writeFile('serverData/stopped', true, (err) => {
                    if (err) throw err;
                    var currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
                    console.log( currentDateTime + ' Start date was updated succesfully');
                });                
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



exports.start = start;
exports.pass = pass;
exports.power = power;
exports.secureRedirect = secureRedirect;
exports.reset = reset;
exports.updateServerOperationStatus = updateServerOperationStatus;
