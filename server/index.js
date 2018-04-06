var five = require("johnny-five"),
  board = new five.Board(),
  temp, red, green, blue,
  current, target, delta = 5,
  io;

var calcState = function(){
  if( target + delta < current){
    blue.on();
    red.off();
  } else if( target - delta > current ) {
    red.on();
    blue.off();
  } else {
    red.off();
    blue.off();
  }
};
var calcTemp = function(){
  temp.query(function(sensor) {
    var val = sensor.value,
      vlt = (val / 1024.0) * 5.0,
      clc = (vlt - .5) * 100,
      frh = Math.round((clc * 1.8) + 32.0);
    current = frh;

    calcState();

    if( io ) {
      io.sockets.emit('read:temp', current);
    }
    console.log('Temp: ', current);
  });
};
board.on("ready", function() {
  temp = new five.Pin("A0");
  red = new five.Led(6);
  green = new five.Led(10);
  blue = new five.Led(9);

  this.loop(5000, function() {
    calcTemp();
  });
  calcTemp();

  process.env.PORT = 7573;
  process.env.NODE_URL = '10.10.47.140';
  require('mahrio').runServer( process.env, __dirname).then( function(server) {
    io = require('socket.io').listen( server.listener );
    server.route({
      method: 'POST',
      path: '/temp',
      handler: function(req, rep){
        if( req.payload.temp ) {
          target = req.payload.temp;
        }
        if( req.payload.delta){
          delta = req.payload.delta;
        }
        calcState();
        rep();
      },
      config: {
        cors: true
      }
    })
  })
});