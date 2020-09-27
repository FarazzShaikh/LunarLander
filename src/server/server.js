/* eslint-disable no-console */
const express = require("express")
const app = express()

const Game = require('../client/js/main')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackDevConfig = require('../../webpack.dev.js');
const compiler = webpack(webpackDevConfig)

const port = process.env.PORT || 5000
const server = app.listen(port)
console.log(`Listening on port :${port}`)

app.use(express.static('dist'))

const socketio = require("socket.io")(server)

var playerNum = 0
socketio.on('connection', socket => {
    playerNum++
    console.log(`Player ${playerNum} connected! -- Bound to socket: `, socket.id)
    socket.on('join_game', joinGame);
    socket.on('input', handleInput);
    socket.on('disconnect', onDisconnect);
})

const game = new Game()

function joinGame(username) {
    
}
  
function handleInput(state) {
    
}
  
function onDisconnect() {
    
}