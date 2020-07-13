// Liest vom Arduino Nano, der an der Adresse 6 lauscht
// zyklisch 16Bit (1 Wort).
// Dient zum Testen der Armaturenschalter

var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

var addr = 0x06;

var inputaddresses = [ 6 ]; // Armaturenbrettschalter an Adresse 6
var inputs = {};
setInterval(() => {
    for (var inputaddress of inputaddresses) {
        try {
            // Der 6er Arduino sendet nur die ersten 16 Eingänge an den Raspi
            inputs[inputaddress] = (i2c.readWordSync(inputaddress)).toString(2).padStart(16, '0');
        } catch (ex) {
            inputs[inputaddress] = -1; // Scheiße war's, der Mond schien helle. Keine Verbindung zum Arduino
        }
	}
	console.log(inputs);
}, 100);

