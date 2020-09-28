import { Vec2D } from "../../utils/Vectors";

export class Gravity {
    constructor() {
        this.g = 9.81 / 6

    }


    calculate(dt, position, velocity, rotation, mass, bounds) {
        let nVelocity = new Vec2D(velocity.x, velocity.y)

        let force = new Vec2D(0, mass * this.g)

        const acc = new Vec2D(
            force.x / mass,
            force.y / mass
        )

        nVelocity.x += acc.x * dt;
        nVelocity.y += acc.y * dt;

        return nVelocity
    }
}