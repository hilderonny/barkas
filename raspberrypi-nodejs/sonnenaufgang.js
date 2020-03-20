var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

var on = true;
var idx = 1;
var addr = 3;

setInterval(() => {
	idx += 1;
	if (idx > 17) {
		idx = 2;
		addr += 1;
		if (addr > 5) {
			addr = 3;
			on = !on;
		}
	}
	var val = (idx << 3) | (on ? 1 : 0);
	//	console.log(val);
	i2c.writeByte(addr, 0x00, val);
}, 20);

