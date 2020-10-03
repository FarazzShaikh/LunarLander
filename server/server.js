// Library Imports.
const express = require('express');
const { default: main } = require('./src/main');
const app = express()
var http = require('http').createServer(app);

// Serves client folder as a static resource at root url.
app.use('/', express.static('client'))
// Serves /client/index.html as entry point to the client.
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Listens for http connections on port 3000.
http.listen(3000, () => {
    console.log('listening on *:3000');
});

// Socket.io entrypoint.
main(http)