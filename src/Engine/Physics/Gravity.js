export class Gravity {
    constructor() {
        this.g = 0.1

        this.framerate = 1 / 60
        this.rho = 1.22; // kg / m^3
        this.A = Math.PI * 15 * 15 / (10000);
        this.Cd = 0.47; // Dimensionless
        this.ag = 9.81;

    }

    checkBounds(position, bounds) {
        return position.x < bounds.right - 1 &&
            position.x > bounds.left - 1 &&
            position.y < bounds.bottom - 1 &&
            position.y > bounds.top - 1
    }

    calculate(dt, position, velocity, mass, bounds) {
        if (this.checkBounds(position, bounds)) {
            var Fx = -0.5 * this.Cd * this.A * this.rho * velocity.x * velocity.x * velocity.x / Math.abs(velocity.x);
            var Fy = -0.5 * this.Cd * this.A * this.rho * velocity.y * velocity.y * velocity.y / Math.abs(velocity.y);

            Fx = (isNaN(Fx) ? 0 : Fx);
            Fy = (isNaN(Fy) ? 0 : Fy);

            // Calculate acceleration ( F = ma )
            var ax = Fx / mass;
            var ay = this.ag + (Fy / mass);

            // Integrate to get velocity
            velocity.x += ax * this.framerate;
            velocity.y += ay * this.framerate;

            // Integrate to get position
            position.x += velocity.x * this.framerate * 100;
            position.y += velocity.y * this.framerate * 100;
        } else {
            velocity.x = 0
            velocity.y = 0
        }
    }
}