import { DEFAULTS } from '../../../../shared/Consts';

// Parent class of all GameObjects
export default class PassiveObject {
	constructor(DOMnode) {
		this.DOMnode = DOMnode;
		this.context = undefined;
	}

	/**
	 * Sets a container to drae the player in.
	 * @param {HTMLDivElement} context The container/render layer to render the Player sprite in.
	 */
	setContext(context) {
		this.context = context;
	}

	/**
	 * Draw Node to the current Context
	 */
	drawDOMNode() {
		this.context.appendChild(this.DOMnode);
	}

	/**
	 * Sets new transforms.
	 * @param {Number} scale New Scale
	 * @param {Number} rot New Rotation
	 * @param {{x: Number, y: Number}} Position New Position
	 */
	transform(scale, rot, { x, y }) {
		this.DOMnode.style.transform = `scale(${scale}) translate(${x}px, ${y}px) rotate(${rot}rad)`;
	}
}
