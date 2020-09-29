export default class Engine {
    constructor(renderer) {
        this.renderer = renderer
        this.terrain = undefined
    }

    registerTerrain(terrain) {

        const backgroundCanvas = this.renderer.getLayer('Background')
        const backgroundCanvasContext = backgroundCanvas.getContext()

        terrain.setContext(backgroundCanvasContext)
        terrain.genTerrain()
        this.terrain = terrain
    }

    update(dt) {
        if(this.terrain) {
            if(this.terrain.needsUpdate) {
                this.terrain.drawTerrain(this.terrain.heightBuffer)
                this.terrain.needsUpdate = false
            }
        }
    }
}