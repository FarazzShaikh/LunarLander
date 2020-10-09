import Physics from './_Physics';

export default class PhysicsTest extends Physics {
	calculateForce(dt) {
		return {
			x: 0,
			y: 0,
		};
	}

	calculateTorque(dt) {
		return 0;
	}
}
