import { Node } from '../Engine/Renderer';

export default class PostProcess extends Node {
	constructor({ name, volume, zIndex }) {
		volume.style.zIndex = zIndex;
		super(name, volume);
	}
	update() {}
}

export class Volume {
	constructor(cssStyles, className) {
		this.node = document.createElement('div');
		this.node.style.width = '100vw';
		this.node.style.height = '100vh';

		this.node.style.position = 'absolute';

		if (className) {
			this.node.classList += className;
		}

		for (const key in cssStyles) {
			if (cssStyles.hasOwnProperty(key)) {
				this.node.style[key] = cssStyles[key];
			}
		}
	}

	getVolume() {
		return this.node;
	}
}
