var net = require('net');
var fs = require('fs');
var csvWriter = require('csv-write-stream');

var N = 1000;
var currentDateTime = "";


function askForMeasurement(callback){

	var client = new net.Socket();

	/***
		Configurar el ip y el puerto del medidor
	***/
	client.connect(8881, '127.0.0.1', function() {
		console.log('Connected');
		/***
			Envio del comando para leer la ultima medicion registrada por el medidor
		***/
		client.write('RMLOGGEDMEAS\r');
	});

	/***
		En caso de error en la conexion
	***/
	client.on('error', function(err) {
		currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
		console.log( currentDateTime + err);
	});

	/***
		Recepcion y procesamiento del dato enviado por el medidor
	***/
	client.on('data', function(data) {
		console.log('Received: ' + data);
		var receivedData = data.toString();
		var splitData = receivedData.split(',');

		/***
			Datos recibidos del medidor
		***/
		var currentElapsedTime = Number(splitData[0]);
		var currentMeasurement = splitData[1];


		fs.readFile('serverData/lastElapsedTime', (err, readTime) => {
	  		if (err) throw err;

	  		var lastElapsedTime = Number(readTime);
			/***
				Verificar si los datos son nuevos comparando con el ultimo elapsed time registrado, si no son nuevos se ignoran los datos recibidos
			***/
	  		if ( lastElapsedTime != currentElapsedTime ) {
	  			
	  			fs.readFile('serverData/startDateTime', (err, readTime) => {
	  				if (err) throw err;
	  				
	  				var startDateMilliseconds = Number(readTime);
	  				var currentDateMilliseconds = startDateMilliseconds + currentElapsedTime * 1000; // convert currentElapsedTime to milliseconds
	  				var dateTimeToRegister = new Date(currentDateMilliseconds);

				    var dateTime = new Date();
				    var currentMonth = dateTime.getMonth() + 1; // los meses considerados por getMonth() son del 0 al 11, por ello se le suma 1 para el tener la numeracion convencional
				    var currentYear = dateTime.getFullYear();

				    
				    var startDate = new Date(startDateMilliseconds).toLocaleString('es').replace(/\//g,'-').replace(' ', '-');
				    //var file = "measurements/mediciones" + "-" + currentMonth + "-" + currentYear + ".csv";
				    var file = "measurements/mediciones" + "-" + startDate + ".csv"; 
				    var dateTime = new Date();
	  				/***
						Se agrega la nueva medicion al archivo
	  				***/
				    fs.stat(file, function(err, stat) {
				      if(err == null) {
				      	  currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
				          console.log( currentDateTime + 'File exists');
				          fs.open(file, 'a+', function (err, fd) {
				            fs.appendFile(file, dateTimeToRegister.toLocaleDateString('es') + ',' +  dateTimeToRegister.toLocaleTimeString('es', { hour12: false }) + ',' + currentElapsedTime + ',' + currentMeasurement + "\n", function (err) {
				              if (err) throw err;
				              console.log( currentDateTime + 'The file has been saved!');
				            });
				          });

				      } else if(err.code == 'ENOENT') {
				          // file does not exist
				          var writer = csvWriter({ headers: ["fecha", "hora", "tiempo transcurrido", "medicion"]});
				          writer.pipe(fs.createWriteStream(file));
				          writer.write([dateTimeToRegister.toLocaleDateString('es'), dateTimeToRegister.toLocaleTimeString('es', { hour12: false }), currentElapsedTime, currentMeasurement]);
				          writer.end();
				      } else {
				      	  currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
				          console.log( currentDateTime + 'Some other error: ', err.code);
				      }


	  				  /***
						  Se actualiza el ultimo elapsed time
	  				  ***/
	                  fs.writeFile('serverData/lastElapsedTime', currentElapsedTime, (err) => {
	                      if (err) throw err;
	                      currentDateTime = new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '');
	                      console.log( currentDateTime + ' Last elapsed time was updated succesfully');
	                  });

					});

	  			});
			}

			client.destroy(); // eliminar al cliente luego de recibir y procesar la respuesta del servidor
		});

	
	});

	client.on('timeout', function(){
		client.destroy(); // eliminar al cliente si no recibe respuesta al darse el timeout
	});

	client.on('close', function() {
		console.log('Connection closed');
	});
	
	callback();
}


function waitNsec(){
    setTimeout(function(){
        askForMeasurement(waitNsec);
    }, N);
}

/***
	main
***/
askForMeasurement(waitNsec);
