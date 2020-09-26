import { Vec2D } from "../../utils/Vectors";

export class Boost {
    constructor({state}) {
        this.state = state
        this.boostStrength = 0
        this.rotation = 0
        this.active = false
        this.framerate = 1 / 60

        document.addEventListener("keydown", (e) => {
            if (true) {
                if(e.code == 'Space') {
                    this.boostStrength = -0.3
                    this.state.setState('fuel', this.state.store.fuel - 0.3)
                    this.active = true
                }
                if(e.code == 'ArrowRight') {
                    this.rotation += -0.05
                    this.state.setState('fuel', this.state.store.fuel - 0.1)
                }
                if(e.code == 'ArrowLeft') {
                    this.rotation += 0.05
                    this.state.setState('fuel', this.state.store.fuel - 0.1)
                }
            }
        });
    }

    calculate(dt, position, velocity, rotation, mass, bounds) {
        let nVelocity = new Vec2D(velocity.x, velocity.y)
        let force = new Vec2D(
            this.boostStrength * -Math.sin(rotation), 
            this.boostStrength * Math.cos(rotation)
        )

        if (this.active) {
            console.log('boost')

            const acc = new Vec2D(
                force.x / mass,
                force.y / mass
            )

            nVelocity.x += acc.x * 1;
            nVelocity.y += acc.y * 1;

        }

        this.boostStrength = 0
        this.active = false
        return nVelocity
    }

    calcRotation(dt, position, rotation, mass) {
        let nRotation = rotation
        nRotation += this.rotation
        this.rotation = 0
        return nRotation
    }
}