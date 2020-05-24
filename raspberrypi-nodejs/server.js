var fs = require('fs'); // For reading certificate files
var express = require('express'); // Webserver
var https = require('https'); // WebRTC needs SSL connections
var socketio = require('socket.io'); // Broadcast handshake messages
var I2C = require('raspi-i2c').I2C;
var i2c = new I2C();

var httpsPort = 443; // Change to your needs

var app = express();
app.use(express.static(__dirname + '/public')); // Serve HTML files from ./public directory

// Prepare SSL certificates for server. Will result in browser warning about untrusted certificates, but it is okay for local tests
var credentials = { 
    key: fs.readFileSync('./priv.key', 'utf8'), 
    cert: fs.readFileSync('./pub.cert', 'utf8')
};

// Prepare HTTPS server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, () => { // Start HTTPS server
    console.log(`HTTPS server is running at port ${httpsPort}.`);
});

// Websockets initialisieren
var io = socketio.listen(httpsServer);
io.on('connection', (socket) => {
    // Handle incoming messages with tag "Message"
    socket.on('led', (data) => {
        // data.addr = 3 .. 5
        // data.port = 2 .. 16
        // data.val = 0/1, theoretisch 0..7
        i2c.writeByte(data.addr, 0x00, (data.port << 3) | data.val);
    });
    // Raspi soll Steuerung übernehmen
    socket.on('takeover', () => {
        i2c.writeByte(0x06, 0x00, 0x01);
        i2c.writeByte(0x03, 0x00, (12 << 3) | 1); // Raspi-Symbol einschalten
        console.log('takeover');
    });
    // Arduino soll steuern
    socket.on('letarduinocontrol', () => {
        i2c.writeByte(0x06, 0x00, 0x00);
        console.log('letarduinocontrol');
    });
    console.log(`Socket ${socket.id} connected.`);
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });
});

