export default class Renderer {
    constructor({layers}) {
       this.layers = layers

    }

    getDoccumentNodes() {
        return this.layers.map(l => l.canvas)
    }

    getLayer(name) {
        return this.layers.find(l => l.name === name)
    }

    update() {
        this.layers.forEach(l => {
            l.clear()
        })
    }

}

export class Layer {
    constructor({name, backgroundColor}) {
        this.name = name
        this.backgroundColor = backgroundColor
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.canvas.style.position = 'absolute'
        this.canvas.style.top = '0'
        this.canvas.style.left = '0'
        this.canvas.classList += "canvas " + this.name
    }

    getContext() {
        return this.ctx
    }

    clear() {
        if(this.backgroundColor) {
            this.ctx.fillStyle = this.backgroundColor
            this.ctx.fillRect(0 ,0, this.canvas.width, this.canvas.height)
        } else {
            this.ctx.clearRect(0 ,0, this.canvas.width, this.canvas.height)
        }
        
    }
}