import { Node } from '../Engine/Renderer';

// Class representing client side Player.
export default class Player extends Node {
	constructor({ id, position, rotation, scale }) {
		const playerNode = document.createElement('div');
		playerNode.style.width = `${25}px`;
		playerNode.style.height = `${25}px`;
		playerNode.style.backgroundColor = 'red';
		playerNode.style.position = 'absolute';
		playerNode.style.display = 'flex';
		playerNode.style.justifyContent = 'center';
		playerNode.style.zIndex = '1000';
		playerNode.classList += `Player-${id}`;

		const normal = document.createElement('div');
		normal.style.width = `${25 / 4}px`;
		normal.style.height = `${25 * 2}px`;
		normal.style.backgroundColor = 'blue';
		playerNode.appendChild(normal);

		super(id, playerNode);

		const p = position || { x: 0, y: 0 };
		const r = rotation || 0;
		const s = scale || 1;

		this.transform({ position: p, rotation: r, scale: s });
	}

	removeDomNode() {
		document.querySelector(`.Player-${this.name}`).remove();
	}
}
