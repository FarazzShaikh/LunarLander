import { Vec2D } from "../utils/Vectors"

export default class Player {
    constructor({name, position, size, modifiers, velocity, rotation, state}) {
        this.name = name ||  `${Math.random()}`
        this.size = size || {w: 50, h: 50}   
        this.bounds = {}
        this.state = state


        this.position = position || new Vec2D(0, 0)
        this.velocity = velocity || new Vec2D(0, 0)

        this.rotation = rotation || Math.PI / 2
        this.rotationalVelocity = 0

        this.mass = 1
        
        this.modifiers = modifiers || {}
        this.framerate = 1 / 60
        this.state.setState('fuel', 100)
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

    calcRotation(dt) {
        this.rotation += this.rotationalVelocity * dt
    }

    calcForces(dt) {
        this.rotationalVelocity = this.modifiers.boost.calcRotation(dt, this.position,this.rotationalVelocity, this.mass)
        this.velocity = this.modifiers.gravity.calculate(dt, this.position, this.velocity, this.rotation, this.mass, this.bounds)
        this.velocity = this.modifiers.drag.calculate(dt, this.position, this.velocity, this.rotation, this.mass, this.bounds)
        this.rotationalVelocity = this.modifiers.drag.calcRotation(dt, this.position,this.rotationalVelocity, this.mass)
        this.velocity = this.modifiers.boost.calculate(dt, this.position, this.velocity, this.rotation, this.mass, this.bounds)
        this.velocity = this.modifiers.collision.calculate(dt, this.position, this.velocity, this.rotation, this.mass, this.bounds)
        this.rotationalVelocity = this.modifiers.collision.calcRotation(dt, this.position, this.rotationalVelocity, this.mass)
    }

    addDomNode() {
        this.playerNode = document.createElement('div')
        this.playerNode.style.width = `${this.size.w}px`
        this.playerNode.style.height = `${this.size.h}px`
        this.playerNode.style.backgroundColor = 'red'
        this.playerNode.style.position = 'absolute'
        this.playerNode.style.display = 'flex'
        this.playerNode.style.justifyContent = 'center'
        this.transform(this.position, this.rotation)
        this.canvas.appendChild(this.playerNode)

        const normal = document.createElement('div')
        normal.style.width = `${this.size.w / 4}px`
        normal.style.height = `${this.size.h * 2}px`
        normal.style.backgroundColor = 'blue'
        
        this.playerNode.appendChild(normal)
    }

    transform(pos, rot) {
        this.playerNode.style.transform = `translate(${pos.x - (this.size.w)}px, ${pos.y - (this.size.h)}px) rotate(${rot}rad)`
    }

    draw() {
        this.transform(this.position, this.rotation)
    }

    setState(dt) {
        this.state.setState('VelX', this.velocity.x)
        this.state.setState('VelY', this.velocity.y)
        this.state.setState('Alt', this.position.y)
        
    }

    update(delta) {
        this.calcForces(delta)
        this.calsPosition(delta)
        this.calcRotation(delta)
        this.setState(delta)
        this.draw()
    }
}