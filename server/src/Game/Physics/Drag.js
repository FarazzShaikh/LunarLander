import { DEFAULTS } from "../../../../shared/Consts";
import Physics from "./_Physics";

export default class Drag extends Physics {
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