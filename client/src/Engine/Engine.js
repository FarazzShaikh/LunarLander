export default class Engine {
    constructor({ renderer, state }) {
        this.state = state
        this.d0 = Date.now();
        

        this.renderer = renderer

        this.backgroundCanvas = this.renderer.getLayer('Background')
        this.backgroundCanvasContext = this.backgroundCanvas.getContext()

        this.spriteCanvas = this.renderer.getLayer('Sprite')
        this.spriteCanvasContext = this.spriteCanvas.getContext()

        this.HUDCanvas = this.renderer.getLayer('HUD')
        this.HUDCanvasContext = this.HUDCanvas.getContext()


        this.players = []
        this.terrain = undefined
    }

    startTimer() {
        this.state.setState('timer', 0)
    }

    registerHUD(HUD) {
        HUD.render(this.HUDCanvasContext)
        this.HUD = HUD
    }

    registerTerrain(terrain) {
        terrain.setContext(this.backgroundCanvasContext)
        terrain.genTerrain()
        this.terrain = terrain
    }

    registerPlayer(player) {
        player.setContext(this.spriteCanvasContext)
        player.addDomNode()
        this.players.push(player)
    }

    update() {
        const delta = this._tick() / 1000

        if(this.terrain.needsUpdate) {
            this.terrain.drawTerrain(this.terrain.heightBuffer)
            this.terrain.needsUpdate = false
        }

        this.players.forEach(p => {
            console.log(p)
            p.update(delta)
        })
    }

    _tick() {
        var now = Date.now();
        var dt = now - this.d0;
        this.d0 = now;
        this.state.setState('timer', this.state.store.timer + dt)
        return dt
    }

}