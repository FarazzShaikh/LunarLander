export default class Engine {
    constructor({ renderer }) {
        this.d0 = Date.now();

        this.renderer = renderer
        this.canvas = this.renderer.canvas
        this.context = this.renderer.getContext()

        this.players = []
    }

    registerPlayer(player) {
        player.setContext(this.context)
        this.players.push(player)
    }

    update() {
        const delta = this._tick()
        this.players.forEach(p => {
            p.update(delta)
        })
    }

    _tick() {
        var now = Date.now();
        var dt = now - this.d0;
        this.d0 = now;
        return dt
    }

}