// var n = 5;
// function myFunc () {
//   console.log('Me ejecuto :) cada ' + n.toString() + 'seconds');
// }

// setTimeout(myFunc, 5000, 'funky');







var dateTimeMilliseconds = Date.now();

console.log(dateTimeMilliseconds);

var dateTime = new Date(Number("1234567") + 300*1000);

console.log(dateTime.toLocaleDateString('es'));
console.log(dateTime.toLocaleTimeString('es', { hour12: false }));

console.log(new Date().toLocaleString('es').replace(/T/, ' ').replace(/\..+/, '') );
