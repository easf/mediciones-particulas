const express = require('express')
const readLastLine = require('read-last-line')
const fs = require('fs')
const app = express()

const REQUIREDROWS = 289;


// set the view engine to ejs
app.set( 'view engine', 'ejs' );

/***
	For including html files 
***/
app.engine('html', require('ejs').renderFile);


app.use(express.static(__dirname + "/"));

function calculate (res, lines) {

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
    
    fs.readFile('factors', (err, factors) => {
        if (err) throw err;    
        var factorValues = factors.toString().split(',');
        var corrFactor = Number(factorValues[0]);
    
        var cProm = cMedSum * corrFactor * 1000 / count;
        var qIndexFactor = Number(factorValues[1]);
        var ica = (cProm/qIndexFactor) * 100;
        ica = ica.toFixed(10);   

        fs.readFile('../serverData/stopped', (err, readStopped) => {
            if (err) throw err;    
            fs.readFile('apiKey', (err, apiKey) => {
                if (err) throw err;    
                res.render( 'pages/airStatus.html', {key: apiKey, value: ica, isStopped: readStopped});     
            });
        });
    });	
}

app.get('/', function (req, res) { 
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
 				calculate(res, lines);               
            });

        }else{
        	calculate(res, lines);
        }


    }).catch( function(err) {
        console.log(err);
    });    


});

app.listen(3000, () => console.log('Example app listening on port 3000!'))