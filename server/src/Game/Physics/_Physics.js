import { DEFAULTS } from "../../../../shared/Consts";
import { Player } from "../Player";

// Parent class of all physics classes
export default class Physics {
    // Assert Abstract Class
    constructor() {
        if (this.constructor == Physics) {
            throw new Error("Physics is an Abstract classes. Abstract classes can't be instantiated.");
        }
    }

    /**
     * Calculates the force to apply.
     */
    calculateForce(dt, velocity) {
        force = {
            x: -0.5 * DEFAULTS.DRAG.cd * DEFAULTS.DRAG.rho * DEFAULTS.DRAG.a *
             Math.pow(velocity.x,2) *
             (velocity.x/Math.abs(velocity.x)),
            y: -0.5 * DEFAULTS.DRAG.cd * DEFAULTS.DRAG.rho * DEFAULTS.DRAG.a *
            Math.pow(velocity.y,2) *
            (velocity.y/Math.abs(velocity.y))
        }
        force.x = (isNaN(force.x) ? 0: force.x);
        force.y = (isNaN(force.y) ? 0: force.y);
        return force
    }

    /**
     * Calculates the Torque to apply
     */
    calculateTorque(torque) {
       return -0.5 * DEFAULTS.DRAG.cd * DEFAULTS.DRAG.rho * DEFAULTS.DRAG.a *
             Math.pow(torque,2) *
             (torque/Math.abs(torque))
    }

}