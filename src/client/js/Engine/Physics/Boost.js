import { Vec2D } from "../../utils/Vectors";

export class Boost {
    constructor() {
        this.boostStrength = {x: 0, y: 0}
        this.active = false
        this.framerate = 1 / 60

        document.addEventListener("keydown", (e) => {
            if (true) {
                switch (e.code) {
                    case 'Space':
                        this.boostStrength.y = -0.5
                        this.active = true
                        break;
                    case 'ArrowRight':
                        this.boostStrength.x = 0.1
                        this.boostStrength.y = 0
                        this.active = true
                        break;
                    case 'ArrowLeft':
                        this.boostStrength.x = -0.1
                        this.boostStrength.y = 0
                        this.active = true
                        break;

                    default:
                        break;
                }
            }



        });
    }

    calculate(dt, position, velocity, mass, bounds) {

        let nVelocity = new Vec2D(velocity.x, velocity.y)
        let force = new Vec2D(this.boostStrength.x, this.boostStrength.y)

        if (this.active) {
            console.log('boost')

            const acc = new Vec2D(
                force.x / mass,
                force.y / mass
            )

            nVelocity.x += acc.x * 1;
            nVelocity.y += acc.y * 1;

        }

        this.boostStrength = {x: 0, y: 0}
        this.active = false

        return nVelocity
    }
}