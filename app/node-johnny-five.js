var five = require("johnny-five"), board = new five.Board(),
  red, green, blue, lcd, button1, button2, temp, control,
  delta = 5, reset, target, current;

var calcTemp = function(){
  temp.query(function(sensor) {
    var val = sensor.value,
      vlt = (val / 1024.0) * 5.0,
      clc = (vlt - .5) * 100,
      frh = Math.round((clc * 1.8) + 32.0);
    current = frh;
    lcd.cursor(0, 0).print( `Current Temp:${current}` );
  });
}
board.on("ready", function() {
  temp = new five.Pin("A0");
  lcd = new five.LCD({
    pins: [12,11,5,4,3,2],
    rows: 2,
    cols: 20
  });
  button1 = new five.Button({
    pin: 7,
    isPullup: true
  });
  button2 = new five.Button({
    pin: 8,
    isPullup: true
  });
  control = new five.Sensor({
    pin: "A1",
    freq: 200
  });
  red = new five.Led(6);
  green = new five.Led(10);
  blue = new five.Led(9);

  lcd.clear();
  green.on();

  this.loop(5000, function() {
    calcTemp();
  });
  calcTemp();
  button1.on("press", function() {
    if( delta < 5){
      delta = delta + 1;
    }

    lcd.cursor(1, 0).print( `Delta Temp: ${delta}  ` );
    reset = 10;
  });
  button1.on("hold", function() {
    console.log('Button1 Held');
  });
  button2.on("press", function() {
    if( delta > 0){
      delta = delta -1;
    }

    lcd.cursor(1, 0).print( `Delta Temp: ${delta}  ` );
    reset = 10;
  });
  button2.on("hold", function() {
    console.log('Button2 Held');
  });
  control.on('data', function(val){
    if ( val == 0){
      val = 58;
    } else if( val == 1024){
      val = 90;
    } else {
      val = val / 32;
      val = 58 + val;
    }
    val = Math.round(val);
    target = val;

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

    if( !reset ) {
      lcd.cursor(1, 0).print( `Target  Temp:${target}` );
    } else {
      reset = reset - 1;
    }

  })
});