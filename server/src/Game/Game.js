import { EVENTS } from "../../../shared/Consts"
import { Player } from "./Player"

export default class Game {
    constructor() {
        this.d0 = Date.now()
        this.players = {}
        this.terrainSeed = Math.random()
        setInterval(this.update.bind(this), 1000/60);
    }

    addPlayer(socket) {
        this.players[socket.id] = new Player({
            socket: socket,
            position: {x: 100, y: 100},
            rotation: undefined
        })
    }

    removePlayer(socket) {
        delete this.players[socket.id]
    }

    update() {
        const dt = this._tick() / 1000
        Object.keys(this.players).forEach(k => {
            this.players[k].socket.emit(EVENTS.SERVER_TICK, dt)
        })
    }

    _tick() {
        var now = Date.now();
        var dt = now - this.d0;
        this.d0 = now;
        return dt
    }
}