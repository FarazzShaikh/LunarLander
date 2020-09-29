import { REQUEST } from '../../shared/Consts';
import Game from './Game/Game';

var IO = require('socket.io');

export default function main(http) {
    const io = IO(http)
    const game = new Game()

    io.on('connection', socket => {
        console.log('User connected', socket.id)
        game.addPlayer(socket)

        socket.on(REQUEST.REQUEST_TERRAIN.req, () => {
            socket.emit(REQUEST.REQUEST_TERRAIN.ack, game.terrainSeed)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id)
            game.removePlayer(socket)
        })
    });
}

