import { Vec2D } from "../../utils/Vectors"

export class Collision {
    constructor({terrain, players}) {
        this.terrain = terrain
        this.heightBuffer = terrain.heightBuffer
        this.hitbox = terrain.bounds
    }

    calculate(dt, position, velocity, mass, bounds) {
        let nVelocity = new Vec2D(velocity.x, velocity.y)

        // 2s = vt + ut
        // vt = ut - 2s
        // v = (ut - 2s) / t

        if(
            position.x > this.hitbox.left &&
            position.x < this.hitbox.right &&
            position.y > this.hitbox.top &&
            position.y < this.hitbox.bottom 
        ) {
            if(this.heightBuffer[Math.floor(position.x)] < position.y) {
                
                

                position.y = this.heightBuffer[Math.floor(position.x)]
                nVelocity.x = 0 

                
            }
        }

        return nVelocity
    }
}