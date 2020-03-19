var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

var on = true;
var idx = 1;

setInterval(() => {
	idx += 1;
	if (idx > 13) {
		idx = 2;
		on = !on;
	}
	var val = (idx << 4) | (on ? 1 : 0);
//	console.log(val);
	i2c.writeByteSync(0x05, 0x00, val);
}, 20);

