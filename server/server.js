// Library Imports.
import * as DB from './db/db';

const express = require('express');
const { default: main } = require('./src/main');
const app = express();
var http = require('http').createServer(app);
const dotenv = require('dotenv').config();
const reload = require('reload');

const port = process.env.PORT || 3000;

DB.init();

app.get('/scores/:uuid', async (req, res) => {
	res.send(await DB.GET(req.params.uuid));
});

// Serves client folder as a static resource at root url.
app.use('/', express.static('client'));
// Serves /client/index.html as entry point to the client.
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// Listens for http connections on port 3000.
reload(app)
	.then(function (reloadReturned) {
		// reloadReturned is documented in the returns API in the README

		// Reload started, start web server
		http.listen(port, () => {
			console.log('\n============================================\n');
			console.log(`|   Listening on *:http://localhost:${port}   |\n`);
			console.log('============================================\n');
		});
	})
	.catch(function (err) {
		console.error('Reload could not start.', err);
	});

// Socket.io entrypoint.
main(http);
