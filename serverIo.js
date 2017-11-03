var fs = require("fs");
var csvWriter = require('csv-write-stream');
var net = require('net');

// Keep track of the chat clients
var clients = [];

/***
  Variables de testeo
***/
var M = 5;
var N = M;
var I = 0;

// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort;

  // Put this new client in the list
  clients.push(socket);


socket.on('data', function (data) {
    var level = data;

    var datetime = new Date();
    // datetime.toLocaleDateString()
    // datetime.toLocaleTimeString()
    //socket.write("You sent this data: " + data + "at this date-time" + datetime.toLocaleDateString() + datetime.toLocaleTimeString() +"\r\n");
    //socket.write("OK");
    var values = ["300,0.013", "600,0.023", "900,0.033", "1200,0.043", "1500,0.053" ];
    I = N % M
    socket.write(values[I]);
    N = N + 1;
    
    console.log(data);
  }); // Remove the client from the list when it leaves

  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  //  broadcast(socket.name + " left the chat.\n");
  });
  
  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message);
  }

}).listen(8881);

// Put a friendly message on the terminal of the server.
console.log("Socket server running at port 8081\n");
