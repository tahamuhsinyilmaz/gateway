const rpio = require('rpio')
const events = require('events');
const em = new events.EventEmitter();
const Gpio = require('onoff').Gpio


const COLS = [40,38,36,32];
const ROWS = [37,35,33,31];

const digits = [
    [ "1", "2", "3", "A"],
    [ "4", "5", "6", "B"],
    [ "7", "8", "9", "C"],
    [ "*", "0", "#", "D"]
];


function setUpTheRowPins(RowPinArray){
    RowPinArray.forEach(rowPin => {
        rpio.open(rowPin,rpio.INPUT,rpio.PULL_DOWN)
    })
}

function numberDetection() {
    COLS.forEach((col, colIndex) => {
			rpio.open(col, rpio.OUTPUT, rpio.HIGH);
			ROWS.forEach((row, rowIndex) => {
				let detectedNumber = rpio.read(row) ? digits[colIndex][rowIndex] : null
				if (detectedNumber) {
					console.log(detectedNumber)
				}
      })
			rpio.open(col, rpio.OUTPUT, rpio.LOW);
	
		})
}


setUpTheRowPins(ROWS)

const star = new Gpio(32, 'in','rising')
const btn = new Gpio(35,'out')
btn.writeSync(1)
star.watch((err, value) => {
    if (err) throw err;

    console.log(value)
});


