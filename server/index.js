var five = require("johnny-five"),
  board = new five.Board(),
  temp,
  current,
  io;

var calcTemp = function(){
  temp.query(function(sensor) {
    var val = sensor.value,
      vlt = (val / 1024.0) * 5.0,
      clc = (vlt - .5) * 100,
      frh = Math.round((clc * 1.8) + 32.0);
    current = frh;

    if( io ) {
      io.sockets.emit('read:temp', current);
    }
    console.log('Temp: ', current);
  });
};
board.on("ready", function() {
  temp = new five.Pin("A0");

  this.loop(5000, function() {
    calcTemp();
  });
  calcTemp();

  process.env.PORT = 7573;
  require('mahrio').runServer( process.env, __dirname).then( function(server) {
    io = require('socket.io').listen( server.listener );
  })
});