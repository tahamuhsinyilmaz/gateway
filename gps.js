var SerialPort = require('serialport');


/*
raspi.init(() => {
    const output = new gpio.DigitalOutput('GPIO18');
    output.write(gpio.HIGH);
});
*/
var port = new SerialPort('/dev/ttyS0', {
    baudRate: 9600
});

port.on('open',()=> console.log('Port was opened'))

// Switches the port into "flowing mode"
port.on('data', function (data) {
    console.log(data.toString());
});


