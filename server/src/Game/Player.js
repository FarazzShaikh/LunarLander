export class Player {
    constructor({socket, position, rotation}) {
        this.socket = socket
        this.position = position || {x: 0, y: 0}
        this.rotation = rotation || Math.PI * 2
    }
}