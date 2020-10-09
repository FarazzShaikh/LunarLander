// Class representing client side Player.
export default class Player {
	constructor({ id, position, rotation }) {
		// Unique identifier.
		this.id = id;
		// Position vector of player.
		this.position = position;
		// Rotation of player in radians.
		this.rotation = rotation;
		// Size of rendered player. Just for debugging.
		this.size = { w: 25, h: 25 };
	}

	/**
	 * Sets a container to drae the player in.
	 * @param {HTMLDivElement} context The container/render layer to render the Player sprite in.
	 */
	setContext(context) {
		this.canvas = context;
	}

	/**
	 * Creates A player dom node and adds it ot the container.
	 */
	addDomNode() {
		this.playerNode = document.createElement('div');
		this.playerNode.style.width = `${this.size.w}px`;
		this.playerNode.style.height = `${this.size.h}px`;
		this.playerNode.style.backgroundColor = 'red';
		this.playerNode.style.position = 'absolute';
		this.playerNode.style.display = 'flex';
		this.playerNode.style.justifyContent = 'center';
		this.transform(this.position, this.rotation);
		this.canvas.appendChild(this.playerNode);

		const normal = document.createElement('div');
		normal.style.width = `${this.size.w / 4}px`;
		normal.style.height = `${this.size.h * 2}px`;
		normal.style.backgroundColor = 'blue';

		this.playerNode.appendChild(normal);
	}

	/**
	 * Removes the player from the dom.
	 */
	removeDomNode() {
		this.canvas.removeChild(this.playerNode);
	}

	/**
	 * Transforms the Player to discribed position and rotation.
	 * @param {{x: Number, y: Number}} pos Position vector of player.
	 * @param {Number} rot Rotation of player in radians.
	 */
	transform(pos, rot) {
		this.playerNode.style.transform = `translate(${pos.x - this.size.w}px, ${
			pos.y - this.size.h
		}px) rotate(${rot}rad)`;
	}

	/**
	 * Runs every frame.
	 * @param {Number} dt Delta-time.
	 */
	update(dt) {
		this.transform(this.position, this.rotation);
	}
}
