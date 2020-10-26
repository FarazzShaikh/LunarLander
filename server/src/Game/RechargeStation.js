import { v4 as uuidv4 } from 'uuid';

export default class RechargeStation {
	constructor({ xPosition, seed }) {
		this.xPosition = xPosition;

		const uuid = uuidv4().split('-');
		this.name = `Station-${uuid[1]}`.toUpperCase();

		const fuel = Math.floor(37 * Math.random() + 15);
		this.resources = {
			fuel: fuel,
			W: -fuel * 100,
			scrap: 0,
		};
	}

	getSerialized() {
		return {
			name: this.name,
			xPosition: this.xPosition,
			resources: this.resources,
		};
	}
}
