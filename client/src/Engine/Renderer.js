// Class Representing the Renderer
export default class Renderer {
	constructor({ layers }) {
		// Array of Layer objects to add to the renderer.
		this.layers = layers;
	}

	/**
	 * Gives div elements for each layer.
	 * @returns {HTMLDivElement} div elements to add to the dom.
	 */
	getDoccumentNodes() {
		return this.layers.map((l) => l.canvas);
	}

	/**
	 * Gets a specific layer.
	 * @param {Sting} name Name of the layer to return.
	 */
	getLayer(name) {
		return this.layers.find((l) => l.name === name);
	}
}

// Class representing a Render Layer.
export class Layer {
	constructor({ name, backgroundColor }) {
		this.name = name;
		this.backgroundColor = backgroundColor;
		this.canvas = document.createElement('div');
		this.canvas.style.width = `${window.innerWidth}px`;
		this.canvas.style.height = `${window.innerHeight}px`;
		this.canvas.style.position = 'absolute';
		this.canvas.style.top = '0';
		this.canvas.style.left = '0';
		this.canvas.classList += 'canvas ' + this.name;
		this.canvas.style.backgroundColor = this.backgroundColor || 'transparent';
	}

	/**
	 * Gets Underlying div element.
	 * @returns {HTMLDivElement}
	 */
	getContext() {
		return this.canvas;
	}
}
