import { Node } from '../Engine/Renderer.js';

export default class HUD extends Node {
	constructor({ name, data }) {
		const node = document.createElement('div');
		node.innerHTML = require('./Components/FPS.html');
		super(name, node.children[0]);

		setInterval(() => {
			this.HTML.textContent = `${data.get()}fps`;
			data.set(0);
		}, 1000);
	}

	update() {}
}
