import { Node } from '../../Engine/Renderer';

export default class HUD extends Node {
	constructor({ name, components }) {
		const node = document.createElement('div');
		node.style.width = '100vw';
		node.style.height = '100vh';

		super(name, node);

		this.components = {};
		for (const key in components) {
			if (components.hasOwnProperty(key)) {
				const component = components[key];
				this.components[key] = new component.class(this.HTML, component.options);
			}
		}
		this.needsUpdate = true;
		this.hidden = false;
	}

	hide() {
		this.hidden = true;
		for (const key in this.components) {
			const component = this.components[key];
			component.HTML.style.display = 'none';
		}
	}

	update(node) {
		const self = node;
		for (const key in self.components) {
			const component = self.components[key];
			component.update(this.anchor);
		}
	}
}
