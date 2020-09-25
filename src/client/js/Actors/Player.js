import { Vec2D } from "../utils/Vectors"

export default class Player {
    constructor({name, position, size, modifiers, velocity, accleration, state}) {
        this.name = name ||  `${Math.random()}`
        this.size = size || {w: 50, h: 50}   
        this.bounds = {}
        this.state = state

        this.position = position || new Vec2D(0, 0)
        this.velocity = velocity || new Vec2D(0, 0)
        this.accleration = accleration || new Vec2D(0, 0)
        this.mass = 1
        
        this.modifiers = modifiers || {}
        this.framerate = 1 / 60
    }

    setContext(context) {
        this.canvas = context
        this.bounds = {
            top: 0,
            left: 0,
            right: Number(this.canvas.style.width.split('p')[0]),
            bottom: Number(this.canvas.style.height.split('p')[0])
        }
    }

    calsPosition(dt) {
        this.position.x += this.velocity.x * dt * 100;
        this.position.y += this.velocity.y * dt * 100;
    }

    calcForces(dt) {
        this.velocity = this.modifiers.gravity.calculate(dt, this.position, this.velocity, this.mass, this.bounds)
        this.velocity = this.modifiers.drag.calculate(dt, this.position, this.velocity, this.mass, this.bounds)
        this.velocity = this.modifiers.boost.calculate(dt, this.position, this.velocity, this.mass, this.bounds)
        this.velocity = this.modifiers.collision.calculate(dt, this.position, this.velocity, this.mass, this.bounds)
        
        
    }

    addDomNode() {
        this.playerNode = document.createElement('div')
        this.playerNode.style.width = `${this.size.w}px`
        this.playerNode.style.height = `${this.size.h}px`
        this.playerNode.style.backgroundColor = 'red'
        this.playerNode.style.position = 'absolute'
        this.translate(this.position)
        this.canvas.appendChild(this.playerNode)
    }

    translate(vec) {
        this.playerNode.style.transform = `translate(${vec.x - (this.size.w)}px, ${vec.y - (this.size.h)}px)`
    }

    draw() {
        this.translate(this.position)
    }

    setState(dt) {
        this.state.setState('VelX', this.velocity.x)
        this.state.setState('VelY', this.velocity.y)
        this.state.setState('Alt', this.position.y)
    }

    update(delta) {
        this.calcForces(delta)
        this.calsPosition(delta)
        this.setState(delta)
        this.draw()
    }
}