var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

var onidx = 2;
var offidx = 1;
var onaddr = 3;
var offaddr = 3;

setInterval(() => {
	onidx += 1;
	if (onidx > 17) {
		onidx = 2;
		onaddr += 1;
		if (onaddr > 5) {
			onaddr = 3;
		}
	}
	i2c.writeByte(onaddr, 0x00, (onidx << 3) | 1);
	offidx += 1;
	if (offidx > 17) {
		offidx = 2;
		offaddr += 1;
		if (offaddr > 5) {
			offaddr = 3;
		}
	}
	i2c.writeByte(offaddr, 0x00, (offidx << 3) | 0);
}, 10);

