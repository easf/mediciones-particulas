
/***
Todo:

Modulos
	@de-lectura: Leer el archivo de las mediciones y tomar las mediciones de las ultimas 24 horas
	@de-calculo: Llevar cabo los calculos correspondientes
	@de-mensaje: Obtencion del mensaje de estado del aire segun el valor calculado en el modulo anterior
***/

/***
	Modulo @De-lectura
***/

const readLastLine = require('read-last-line');
const REQUIREDROWS = 289;
var fs = require('fs');

function updateAirStatus(){
	var dateTime = new Date();
	var currentYear = dateTime.getFullYear();
	var fileName = 'mediciones/mediciones-' + currentYear + '.csv';

	readLastLine.read(fileName, REQUIREDROWS).then(function (lines) {
	    //console.log(lines.split('\n'))
	    lines = lines.split('\n');
	    //if ( isNaN(lines[0].split(',').slice(-1)[0]) ){

	    //}
	    if (lines.length < REQUIREDROWS) {
	    	var previousYear = currentYear - 1;
			var previousFile = 'mediciones/mediciones-' + previousYear + '.csv';    	
			readLastLine.read(previousFile, REQUIREDROWS - lines.length).then(function (remLines) {
				remLines = remLines.split('\n');
				//console.log(remLines);
				lines = lines.concat(remLines);
				console.log('\nRem Lines :'+remLines.length);
				var currentLine = "";
	    		var currentValue = "";
	    		var cMedSum = 0;
	    		var count = 0;
			    for (var i = lines.length - 1; i >= 0; i--) {
			    	currentLine = lines[i];
			    	if (currentLine.length > 0){
			    		currentValue = currentLine.split(',').slice(-1)[0];
			    	//	if ( ! isNaN(currentValue)  ){
			    		    //console.log( Number(currentValue) );
			    			cMedSum = cMedSum + Number(currentValue);
			    			count++;
			    	//	}
			    	}
				}
				cMedSum = cMedSum.toFixed(10);
				console.log(cMedSum);
				fs.readFile('serverData/factors', (err, factors) => {
					if (err) throw err;    
					var factorValues = factors.toString().split(',');
					var corrFactor = Number(factorValues[0]);
					console.log(corrFactor);
					var cProm = cMedSum * corrFactor * 1000 / count;
					var qIndexFactor = Number(factorValues[1]);
					var ica = (cProm/qIndexFactor) * 100;
					console.log(ica);	
				});
			});
	    }


	}).catch( function(err) {
	    console.log(err);
	});

}

exports.updateAirStatus = updateAirStatus;