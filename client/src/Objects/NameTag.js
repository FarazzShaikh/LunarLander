import { Node } from '../Engine/Renderer';
import '../../Shared/CRT.css';

export default class NameTag extends Node {
	constructor({ name, position, rotation, scale, string, color }) {
		const node = document.createElement('div');

		node.style.padding = '8px';
		node.style.margin = '0';

		node.style.position = 'absolute';

		node.style.fontFamily = 'monospace';
		node.style.fontSize = '15px';
		node.style.fontWeight = '100';

		node.style.color = color;
		// node.style.textShadow = `0px 0px 13px ${color}`;
		node.innerHTML = string;

		node.className += '';

		super(name, node);

		const p = position || { x: 0, y: 0 };
		const r = rotation || 0;
		const s = scale || 1;

		this.transform({ position: p, rotation: r, scale: s });
	}

	setText(text) {
		if (this._isInViewport(this.position, 300 * 2)) {
			this.HTML.innerHTML = text;
		}
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

		if (self._isInViewport(p, 300 * 2)) {
			if (self.HTML.style.display !== 'block') self.HTML.style.display = 'block';
			self.HTML.style.transform = `scale(${s},${s}) translate(${p.x}px,${p.y}px) rotate(${r}rad)`;
		} else {
			if (self.HTML.style.display !== 'none') self.HTML.style.display = 'none';
		}
	}
}
