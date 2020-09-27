import { Vec2D } from "../../utils/Vectors"

export class Collision {
    constructor({terrain, players, state}) {
        this.terrain = terrain
        this.state = state
        this.heightBuffer = terrain.heightBuffer
        this.hitbox = terrain.bounds
    }

    calculate(dt, position, velocity, rotation, mass, bounds) {
        let nVelocity = new Vec2D(velocity.x, velocity.y)

        if(
            position.x > this.hitbox.left &&
            position.x < this.hitbox.right &&
            position.y > this.hitbox.top &&
            position.y < this.hitbox.bottom 
        ) {
            if(this.heightBuffer[Math.floor(position.x)] < position.y) {
                
                this.state.setState('killplayer',true)

                position.y = this.heightBuffer[Math.floor(position.x)]
                nVelocity.x = 0 
                nVelocity.y = 0

                
            }
        }

        return nVelocity
    }

    calcRotation(dt, position, rotation, mass) {
        let nRotation = rotation

        if(
            position.x > this.hitbox.left &&
            position.x < this.hitbox.right &&
            position.y > this.hitbox.top &&
            position.y < this.hitbox.bottom 
        ) {
            if(this.heightBuffer[Math.floor(position.x)] <= position.y) {
                this.state.setState('killplayer', true)
                nRotation = 0 
            }
        }

        return nRotation
    }
}