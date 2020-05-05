var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

// Das Relais ist an Adresse 20 oder 21

var on = false;
var addr = 0x20;

setInterval(() => {
	on = !on;
	for (var i = 0; i < 8; i++) {
//		i2c.writeByte(0x21, i, on ? 1 : 0);
		i2c.writeByte(0x20, i, on ? 1 : 0);
	}
}, 500);

