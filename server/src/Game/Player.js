
// Class representing a player.
export class Player {
    constructor({socket, position, rotation}) {
        // Socket associated with the player
        this.socket = socket
        // Players position vector in 2D space
        this.position = position || {x: 0, y: 0}
        // Players rotation in radians.
        this.rotation = rotation || Math.PI * 2

    }

    /**
     * Returns serialized form of Player.
     * Easy to transmit over Socket.emit().
     * @returns  Serialized form of Player.
     */
    getSerialized() {
        return {
            id: this.socket.id,
            position: this.position,
            rotation: this.rotation
        }
    }
}