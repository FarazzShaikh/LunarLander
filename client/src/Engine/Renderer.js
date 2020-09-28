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
}

export class Layer {
    constructor({name, backgroundColor}) {
        this.name = name
        this.backgroundColor = backgroundColor
        this.canvas = document.createElement('div')
        this.canvas.style.width = `${window.innerWidth}px`
        this.canvas.style.height = `${window.innerHeight}px`
        this.canvas.style.position = 'absolute'
        this.canvas.style.top = '0'
        this.canvas.style.left = '0'
        this.canvas.classList += "canvas " + this.name
        this.canvas.style.backgroundColor = this.backgroundColor || 'transparent'
    }

    getContext() {
        return this.canvas
    }
}