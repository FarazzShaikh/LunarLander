export default class Engine {
    constructor({ renderer }) {
        this.d0 = Date.now();

        this.renderer = renderer

        this.backgroundCanvas = this.renderer.getLayer('Background')
        this.backgroundCanvasContext = this.backgroundCanvas.getContext()

        this.spriteCanvas = this.renderer.getLayer('Sprite')
        this.spriteCanvasContext = this.spriteCanvas.getContext()


        this.players = []
        this.terrain = undefined
    }

    registerTerrain(terrain) {
        terrain.setContext(this.backgroundCanvasContext)
        terrain.genTerrain()
        this.terrain = terrain
    }

    registerPlayer(player) {
        player.setContext(this.spriteCanvasContext)
        this.players.push(player)
    }

    update() {
        const delta = this._tick()

        this.spriteCanvas.clear()
        if(this.terrain.needsUpdate) {
            this.backgroundCanvas.clear()
            this.terrain.drawTerrain(this.terrain.heightBuffer)
            this.terrain.needsUpdate = false
        }

        
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