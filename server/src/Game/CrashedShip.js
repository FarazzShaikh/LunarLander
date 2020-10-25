import { v4 as uuidv4 } from 'uuid';
import { nameByRace } from 'fantasy-name-generator';

export class CrashedShip {
	constructor({ xPosition, seed }) {
		this.xPosition = xPosition;

		const uuid = uuidv4().split('-');
		const name = nameByRace('fairy', { gender: 'female' });
		this.name = `${uuid[1]}-${name}`.toUpperCase();

		this.resources = {
			fuel: Math.floor(37 * Math.random() + 15),
			W: Math.floor(370 * Math.random() + 25),
			scrap: Math.floor(100 * Math.random()),
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
