// Interface imports
import { Socket } from 'socket.io';

// Import Objects and Classes
import { DEFAULTS, EVENTS } from "../../../shared/Consts"
import { Player } from "./Player"

// Class representing the Game.
export default class Game {
    
    constructor() {
        // Used to calculate delta-time (dt, time between consecutive ticks)
        this.d0 = Date.now()
        // List of all the players in the game. {Socket.id: Socket}
        this.players = {}
        // Seed for terrain. Consistant across all clients.
        this.terrainSeed = Math.random()
        // Runs the update function every 1/60th of a second.
        setInterval(this.update.bind(this), 1000/60);

    }

    /**
     * @returns All players in the game.
     */
    getPlayers() {
        return Object.values(this.players).map(v => v.getSerialized())
    }

    /**
     * Adds a player to the game.
     * @param {Socket} socket Socket of the player to add.
     */
    addPlayer(socket) {
        this.players[socket.id] = new Player({
            socket: socket,
            position: {x: 500 * Math.random(), y: 100},
            rotation: undefined
        })
    }

    /**
     * Removes a player to the game.
     * @param {Socket} socket Socket of the player to remove.
     */
    removePlayer(socket) {
        delete this.players[socket.id]
    }

    /**
     * Function that moves the player in responce to Keybpard input
     * @param {Socket} socket 
     * @param {String} type 
     */
    movePlayer(socket, type) {
        if(this.players[socket.id]) {
            switch (type) {
                case 'BOOST':
                    this.players[socket.id].applyForce({
                        x: DEFAULTS.MOVEMENT_STRENGTH.BOOST,
                        y: DEFAULTS.MOVEMENT_STRENGTH.BOOST
                    }, true)
                    break;
            
                case 'P_ROTATE':
                    this.players[socket.id].applyTorque(DEFAULTS.MOVEMENT_STRENGTH.P_ROTATE)
                    break;

                case 'N_ROTATE':
                    this.players[socket.id].applyTorque(DEFAULTS.MOVEMENT_STRENGTH.N_ROTATE)
                    break;

                default:
                    break;
            }
        }
        
    }



    /**
     * Update Function called every 1/60th of a second.
     */
    update() {
        const dt = this._tick() / 1000
        Object.values(this.players).forEach(player => {
            player.socket.emit(EVENTS.SERVER_TICK, dt)
            const pchange = player.update(dt)

            //Checks for player position changes and updates their position
            if(pchange){ 
                player.socket.emit(EVENTS.SERVER_UPDATE_PLAYER, player.getSerialized())
            }

        })
    }

    /**
     * @private Used to calculate delta-time (dt, time between consecutive ticks)
     */
    _tick() {
        var now = Date.now();
        var dt = now - this.d0;
        this.d0 = now;
        return dt
    }
}