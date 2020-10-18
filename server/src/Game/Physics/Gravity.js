import { DEFAULTS } from '../../../../shared/Consts';
import Physics from './_Physics';

export default class Gravity extends Physics {
	/**
	 * Calculates the force to apply.
	 */
	calculateForce(dt) {
		return {
			x: 0,
			y: DEFAULTS.GRAVITY.g,
		};
	}

	calculateTorque(dt) {
		return 0;
	}
}
