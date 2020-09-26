import { Vec2D } from "../../utils/Vectors";

export class Drag {
    constructor() {
        this.rho = 1.204
        this.Cd = 1.05

    }


    calculate(dt, position, velocity, rotation, mass, bounds) {
        let nVelocity = new Vec2D(velocity.x, velocity.y)

        const A = (6 * 50**2) / (10000);

        const force = new Vec2D(
            -0.5 * this.Cd * A * this.rho * nVelocity.x * nVelocity.x * nVelocity.x / Math.abs(nVelocity.x),
            -0.5 * this.Cd * A * this.rho * nVelocity.y * nVelocity.y * nVelocity.y / Math.abs(nVelocity.y)
        )

        
        force.x = (isNaN(force.x) ? 0 : force.x);
        force.y = (isNaN(force.y) ? 0 : force.y);

        const acc = new Vec2D(
            force.x / mass,
            force.y / mass
        )

        nVelocity.x += acc.x * dt;
        nVelocity.y += acc.y * dt;

        return nVelocity
    }

    calcRotation(dt, position, rotation, mass) {
        let nRotation = rotation

        const A = (6 * 50**2) / (10000);

        let force = -0.5 * this.Cd * A * this.rho * nRotation * nRotation * nRotation / Math.abs(nRotation)

        force = (isNaN(force) ? 0 : force);

        const acc = force / mass

        nRotation += acc * dt;

        return nRotation
    }
}