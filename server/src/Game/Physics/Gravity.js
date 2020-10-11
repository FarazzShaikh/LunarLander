import Physics from './_Physics';

export default class Gravity extends Physics {
    /**
	 * Calculates the force to apply.
	 */
    calculateForce(dt) {
		return {
			x: 0,
			y: -0.098,
		};
	}

	calculateTorque(dt) {
		return 0;
	}
}