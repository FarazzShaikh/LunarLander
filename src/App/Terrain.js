import { noise as Perlin } from '@chriscourses/perlin-noise'

export default class Terrain {
    constructor() {
        this.heightBuffer = []

        this.ctx = undefined
        this.bounds = {}

        this.needsUpdate = true
    }

    setContext(context) {
        this.ctx = context
        this.bounds = {
            top: 10E7,
            left: 0,
            right: this.ctx.canvas.width,
            bottom: this.ctx.canvas.height
        }
    }

    genTerrain() {
        for (let x = 0; x < this.bounds.right; x++) {
            let noise = (Perlin(x * 0.01) * 100) + 500

            this.bounds.top = noise < this.bounds.top ? noise : this.bounds.top

            this.heightBuffer.push(noise)

        }
        return this.heightBuffer;
    }

    drawTerrain(terrain) {
        this.ctx.strokeStyle = 'white'
        this.ctx.moveTo(0, terrain[0])

        for (let x = 0; x < this.bounds.right; x++) {
            this.ctx.lineTo(x, terrain[x])  

            
        }
        this.ctx.stroke()

        this.ctx.strokeStyle = 'red'
        this.ctx.strokeRect(this.bounds.left, this.bounds.top, this.bounds.right, this.bounds.bottom);
    }

    getValue(x) {
        return this.heightBuffer[x]
    }

}