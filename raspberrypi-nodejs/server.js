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

// Schalter initialisieren
var inputaddresses = [ 6 ]; // Armaturenbrettschalter an Adresse 6
var inputs = {};
setInterval(() => {
    for (var inputaddress of inputaddresses) {
        try {
            inputs[inputaddress] = i2c.readWordSync(inputaddress);
        } catch (ex) {
            inputs[inputaddress] = -1; // Scheiße war's, der Mond schien helle. Keine Verbindung zum Arduino
        }
    }
}, 50);
app.use('/inputs', (_, res) => { // Eingangswerte einfach zurück geben an URL /inputs
    res.send(JSON.stringify(inputs));
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
    console.log(`Socket ${socket.id} connected.`);
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });
});

