import Physics from './_Physics';

export default class Wind extends Physics {
    /**
	 * Calculates the force to apply.
	 */
    calculateForce(dt) {
        return {
            x : 0.08 * Math.sin(dt*20),
            y : 0
        };    
    } 
    
    calculateTorque(dt) {
        return 0;
    }
}

