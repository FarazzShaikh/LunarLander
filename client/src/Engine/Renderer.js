import { DEFAULTS } from '../../../shared/Consts';
import { noise as Perlin, noiseSeed } from '@chriscourses/perlin-noise';
import PassiveObject from '../Objects/PassiveObjects/_PassiveObject';

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

	/**
	 * Scatters Nodes Around Randomly
	 * @param {Array<PassiveObject>} nodes Nodes To Scatter
	 * @param {Number} seed Random Seed
	 */
	scatterNodes(nodes, seed) {
		for (let i = 0; i < DEFAULTS.SCATTER.N; i++) {
			nodes.forEach((C, _) => {
				noiseSeed(i * seed * 10000 + _ + 0.1);
				const n = new C(seed * i);

				const scale = Perlin(100000) * (n.scaleMultiplier || 1);

				n.transform(scale, 1, {
					x: Perlin(1000) * window.innerWidth,
					y: Perlin(10000) * 600,
				});

				n.setContext(this.canvas);
				n.drawDOMNode();
			});
		}
	}

	/**
	 * Adds Nodes To Layer
	 * @param {Array<PassiveObject>} nodes Nodes to add
	 */
	addNodes(nodes) {
		nodes.forEach((n) => {
			n.setContext(this.canvas);
			n.drawDOMNode();
		});
	}
}
