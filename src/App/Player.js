import { Vec2D } from "../utils/Vectors"

export default class Player {
    constructor({name, position, size, modifiers, velocity}) {
        this.name = name ||  `${Math.random()}`
        this.size = size || {w: 50, h: 50}   
        this.bounds = {}

        this.position = position || new Vec2D(0, 0)
        this.velocity = this.velocity || new Vec2D(0, 0)
        this.mass = 1
        
        this.modifiers = modifiers || {}
    }

    setContext(context) {
        this.ctx = context
        this.bounds = {
            top: 0,
            left: 0,
            right: this.ctx.canvas.width,
            bottom: this.ctx.canvas.height
        }
    }

    calcModifiers(dt) {
        this.modifiers.gravity.calculate(dt, this.position, this.velocity, this.mass, this.bounds)
        this.modifiers.boost.calculate(dt, this.position, this.velocity, this.mass, this.bounds)
    }

    update(delta) {
        this.calcModifiers(delta)
        this.ctx.fillStyle = 'teal'
        this.ctx.fillRect(this.position.x - this.size.h, this.position.y - this.size.w, this.size.w, this.size.h)
    }
}