const rpio = require('rpio')
const sleep = require('sleep')
const Gpio = require('onoff').Gpio


let useKeypad = true
const COLS = [40,38,36];//[40,38,36,32];
const ROWS = [37,35,33,31];//[37,35,33,31];

const digits = [
	[ "1", "2", "3", "A"],
	[ "4", "5", "6", "B"],
	[ "7", "8", "9", "C"],
	[ "*", "0", "#", "D"]
];


function setUpRowPins(RowPinArray){
	RowPinArray.forEach(rowPin => {
		rpio.open(rowPin,rpio.INPUT,rpio.PULL_DOWN)
	})
}

function setUpColPins(ColPinArray) {
	ColPinArray.forEach(colPin=>{
		rpio.open(colPin,rpio.OUTPUT)
	})
}

function numberDetection() {
	COLS.forEach((col, colIndex) => {
		rpio.write(col, rpio.HIGH);
		ROWS.forEach((row, rowIndex) => {
			let detectedNumber = rpio.read(row) ? digits[colIndex][rowIndex] : null
			if (detectedNumber) {
				console.log(detectedNumber)
			}
		})
		rpio.write(col, rpio.LOW);
		
	})
}


let starRow = new Gpio(12, 'in','rising')
let starCol = new Gpio(26,'out')
// let  diezRow = new Gpio(12,'in','rising')
// let diezCol = new Gpio(13,'out')
//
//
starCol.writeSync(1)
// diezCol.writeSync(1)

starRow.watch((err, value) => {
	if (err) throw err;
	if (value==1){
		starRow.unexport()
		starCol.unexport()
		setUpRowPins(ROWS)
		setUpColPins(COLS)
		while (true){
			numberDetection()
		}
	}
	
});