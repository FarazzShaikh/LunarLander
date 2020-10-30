import { Simple1DNoise } from '../../../shared/utils/SimplexNoise';

export default class Renderer {
	constructor(layers, anchor) {
		this.layers = layers;
		this.nodes = {};
		this.anchor = anchor || null;

		this.layers.forEach((l) => {
			document.body.appendChild(l.container);
		});

		document.body.style.overflow = 'hidden';
	}

	setAnchor(nodeName) {
		const node = this.nodes[nodeName];
		node.deltaP = { x: 0, y: 0 };
		this.anchor = node;
	}

	scatterNode({ layerName, Class, options, number, seed }) {
		const layer = this.layers.filter((l) => l.name === layerName)[0];
		const noise = new Simple1DNoise(seed);

		for (let i = 0; i < number; i++) {
			const node = new Class(options);
			this.nodes[`${layer}-${node.name}-n${i}`] = node;

			const s = Math.abs(
				noise.getVal(i * 100 + seed) * (node.scaleMultiplier || 1)
			);

			const o = noise.getVal(i * 100 + seed) + 0.2;

			const p = {
				x: Math.abs(noise.getVal(i * 10000 + seed)) * window.innerWidth * 0.8,
				y: Math.abs(noise.getVal(i * 1000 + seed)) * 300,
			};

			node.HTML.style.transform = `scale(${s},${s}) translate(${p.x}px,${p.y}px) rotate(0rad)`;
			node.HTML.style.filter += `brightness(${o})`;
			node.needsUpdate = false;

			layer.container.appendChild(node.HTML);
		}
	}

	addNode(layer, node) {
		this.nodes[`${layer}-${node.name}`] = node;

		this.layers
			.filter((l) => l.name === layer)[0]
			.container.appendChild(node.HTML);
	}

	getNode(name) {
		return this.nodes[name];
	}

	getNodes() {
		return Object.values(this.nodes);
	}

	removeNode(name) {
		if (this.nodes[name]) {
			this.nodes[name].HTML.remove();
		}

		delete this.nodes[name];
	}

	render(offset) {
		for (const key in this.nodes) {
			if (this.nodes.hasOwnProperty(key)) {
				const node = this.nodes[key];
				if (node.needsUpdate) {
					node.update.call(this, node);
				}
			}
		}
	}

	_isElementPartiallyInViewport(el) {
		var rect = el.getBoundingClientRect();
		var windowHeight =
			window.innerHeight || document.documentElement.clientHeight;
		var windowWidth = window.innerWidth || document.documentElement.clientWidth;

		var vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
		var horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

		return vertInView && horInView;
	}
}

export class Node {
	constructor(name, HTML) {
		this.name = name;
		this.HTML = HTML;

		this.position = {
			x: 0,
			y: 0,
		};
		this.prevP = {
			x: 0,
			y: 0,
		};
		this.deltaP = {
			x: 0,
			y: 0,
		};
		this.rotation = 0;
		this.scale = 1;
		this.needsUpdate = false;
	}

	transform({ position, rotation, scale }) {
		this.needsUpdate = true;

		this.position = position || this.position;
		this.rotation = rotation || this.rotation;
		this.scale = scale || this.scale;
		this.deltaP = {
			x: this.position.x - this.prevP.x,
			y: this.position.y - this.prevP.y,
		};
		this.prevP = { ...this.position };
	}

	update(node) {
		const self = node;
		let p = { ...self.position };
		const s = self.scale;
		const r = self.rotation;

		if (this.anchor) {
			if (this.anchor.name === self.name) {
				p.x = window.innerWidth / 2;
				//p.y = window.innerHeight / 2;
			} else {
				p.x -= this.anchor.position.x;
				//p.y -= this.anchor.position.y;
			}
		}

		self.HTML.style.transform = `translate(${p.x}px,${p.y}px) rotate(${r}rad)`;
		self.HTML.style.width = `${
			s * Number(self.HTML.style.width.split('p')[0])
		}px`;
		self.needsUpdate = false;
	}
}

export class Layer {
	constructor({ name, zIndex, backgroundColor, scatter, image }) {
		this.name = name;
		this.scatter = scatter || false;
		this.container = document.createElement('div');

		this.container.style.width = '100vw';
		this.container.style.height = '100vh';

		this.container.style.position = 'absolute';
		this.container.style.top = '0';
		this.container.style.left = '0';

		this.container.style.backgroundColor = backgroundColor
			? backgroundColor
			: 'transparent';

		this.container.style.zIndex = `${zIndex}`;
		this.container.classList += `layer-${name}`;

		if (image) {
			this.container.style.background = `url(${image}) 0px 0px`;

			this.container.style.imageRendering = 'pixelated';
		}
	}
}
