const HMC5883L_REG_CONFIG_A = 0x00;
const HMC5883L_REG_CONFIG_B = 0x01;

const HMC5883L_REG_MODE =   0x02;
const HMC5883L_REG_MSB_X =  0x03;
const HMC5883L_REG_LSB_X =  0x04;
const HMC5883L_REG_MSB_Z =  0x05;
const HMC5883L_REG_LSB_Z =  0x06;
const HMC5883L_REG_MSB_Y =  0x07;
const HMC5883L_REG_LSB_Y =  0x08;
const HMC5883L_REG_STATUS = 0x09;
const HMC5883L_REG_ID_A =   0x0a;
const HMC5883L_REG_ID_B =   0x0b;
const HMC5883L_REG_ID_C =   0x0c;

const HMC5883L_MODE_CONTINUOUS = 0x00;
const HMC5883L_MODE_SINGLE     = 0x01;

const HMC5883L_ADDRESS = 0x1e;
//
// const i2c = require('i2c');
// const address = 0x18;
// const wire = new i2c(HMC5883L_REG_LSB_X, {device: '/dev/i2c-1'});
//
// function toShort(value) {
//     if ((value & (1<<15)) == 0) {
//         return value;
//     }
//     return (value & ~(1<<15)) - (1<<15);
// }
//
// wire.readBytes(HMC5883L_REG_MSB_X, 8, function(err, res) {
//     console.log(res)
// });
//

const wpi = require('wiring-pi');
wpi.setup('wpi');
var fd = wpi.wiringPiI2CSetup(HMC5883L_ADDRESS);
wpi.wiringPiI2CWriteReg8(fd, HMC5883L_REG_MODE, HMC5883L_MODE_CONTINUOUS);

function toShort(value) {
	if ((value & (1<<15)) == 0) {
		return value;
	}
	return (value & ~(1<<15)) - (1<<15);
}

readMag = function() {
	var msb = wpi.wiringPiI2CReadReg8(fd, HMC5883L_REG_MSB_X);
	var lsb = wpi.wiringPiI2CReadReg8(fd, HMC5883L_REG_LSB_X);
	var x = toShort(msb << 8 | lsb);
	
	msb = wpi.wiringPiI2CReadReg8(fd, HMC5883L_REG_MSB_Y);
	lsb = wpi.wiringPiI2CReadReg8(fd, HMC5883L_REG_LSB_Y);
	var y = toShort(msb << 8 | lsb);
	
	msb = wpi.wiringPiI2CReadReg8(fd, HMC5883L_REG_MSB_Z);
	lsb = wpi.wiringPiI2CReadReg8(fd, HMC5883L_REG_LSB_Z);
	var z = toShort(msb << 8 | lsb);
	return {x: x, y: y, z: z};
};
readMag()