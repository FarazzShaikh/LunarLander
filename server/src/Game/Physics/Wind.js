import { DEFAULTS } from '../../../../shared/Consts';
import Physics from './_Physics';

export default class Wind extends Physics {
	/**
	 * Calculates the force to apply.
	 */
	calculateForce(dt) {
		return {
			x: DEFAULTS.WIND.speed * Math.sin(dt * 20),
			y: 0,
		};
	}

	calculateTorque(dt) {
		return 0;
	}
}
