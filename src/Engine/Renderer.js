export default class Renderer {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    getContext() {
        return this.ctx
    }

    drawTerrain(terrain) {
        const ctx = this.canvas.getContext('2d')
        ctx.strokeStyle = 'white'
        ctx.moveTo(0, (terrain[0] * 100) + 500)

        for (let x = 0; x < this.canvas.width; x++) {
            ctx.lineTo(x, (terrain[x] * 100) + 500)   
        }
        ctx.stroke()
    }

    clear() {
        const ctx = this.canvas.getContext('2d')
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

}

