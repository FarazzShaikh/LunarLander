export class Collision {
    constructor({terrain, players}) {
        this.terrain = terrain
        this.heightBuffer = terrain.heightBuffer
        this.hitbox = terrain.bounds
        console.log(this.hitbox)
    }

    calculate(dt, position, velocity, mass, bounds) {
        if(
            position.x > this.hitbox.left &&
            position.x < this.hitbox.right &&
            position.y > this.hitbox.top &&
            position.y < this.hitbox.bottom 
        ) {
            if(this.heightBuffer[Math.floor(position.x)] < position.y) {
                velocity.y = 0
                velocity.x = 0
                return true
            }
            return false
        } else {
            return false
        }
    }
}