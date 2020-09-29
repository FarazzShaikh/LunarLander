const express = require('express');
const { default: main } = require('./src/main');
const app = express()
var http = require('http').createServer(app);


app.use('/', express.static('client'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

main(http)