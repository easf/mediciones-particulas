var net = require('net');
var fs = require("fs");

/***
    session variable
***/
var sess = null;

function start ( req, res ) {
    console.log ( "Request handler 'start' was called." );    
    res.render( 'pages/index.html');
}

function pass ( req, res ) {
    console.log ( "Request handler 'pass' was called." );  
    if (sess){
        res.redirect('/power2389564732112838990');
    } else {
        res.render( 'pages/password.html');
    }
}

function resetPass ( req, res ) {
    console.log ( "Request handler 'resetPass' was called." ); 

    fs.writeFile('serverData/key', req.body.key, (err) => {
        if (err) throw err;
        console.log(' Key access was updated succesfully');
    });    

    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.write("Clave actualizada exitosamente");
    res.end();
}

function secureRedirect ( req, res ) {
    console.log ( "Request handler 'power' was called." );    
    fs.readFile('serverData/key', (err, readKey) => {
        if (err) throw err;
        
        if ( req.body.key.toString() === readKey.toString() ){
            sess=req.session;
            res.redirect('/power2389564732112838990');

        } else {
            res.render( 'pages/fail.html', { id: 'pass'} );
        }
    });

}

function power ( req, res ) {
    console.log ( "Request handler 'power' was called." );
    if (sess){
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
            console.log(data);
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
exports.pass = pass;
exports.power = power;
exports.secureRedirect = secureRedirect;
exports.resetPass = resetPass;
exports.updateServerOperationStatus = updateServerOperationStatus;
