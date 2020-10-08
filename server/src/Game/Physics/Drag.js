import { DEFAULTS } from "../../../../shared/Consts";
import Physics from "./_Physics";

export default class Drag extends Physics {
    /**
        * Calculates the force to apply.
        */
    calculateForce(dt, velocity) {
        let force = {
            x: 0.5 * DEFAULTS.DRAG.cd * DEFAULTS.DRAG.rho * DEFAULTS.DRAG.a *
                velocity.x * velocity.x *
                (velocity.x / Math.abs(velocity.x)),
            y: 0.5 * DEFAULTS.DRAG.cd * DEFAULTS.DRAG.rho * DEFAULTS.DRAG.a *
                velocity.y * velocity.y *
                (velocity.y / Math.abs(velocity.y))
        }
        force.x = (isNaN(force.x) ? 0 : force.x);
        force.y = (isNaN(force.y) ? 0 : force.y);
        return force
    }

    /**
     * Calculates the Torque to apply
     */
    calculateTorque(torque) {
        let force = -0.5 * DEFAULTS.DRAG.cd * DEFAULTS.DRAG.rho * DEFAULTS.DRAG.a *
            torque * torque *
            (torque / Math.abs(torque))

        force = (isNaN(force) ? 0 : force);
        return force
    }
}